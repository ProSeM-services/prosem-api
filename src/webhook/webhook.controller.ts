import { Controller, Post, Req, HttpCode } from '@nestjs/common'

import { PreApproval } from 'mercadopago'
import { mercadopago } from 'src/core/config/mercadopago'
import { Request as ExpressRequest } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { PaymentsService } from 'src/payments/payments.service'
import { PaymentStatus } from 'src/payments/constants/payment-status'
@Controller('webhooks')
export class WebhookController {
	constructor(
		private authService: AuthService,
		private readonly userService: UserService,
		private readonly paymentService: PaymentsService
	) {}
	@Post('mercadopago')
	@HttpCode(200) // Importante: siempre responder con 200 O
	// K para que MP no reintente
	async subscribe(@Req() req: ExpressRequest) {
		const { type, data } = req.body
		const { id: payment_id } = data

		if (type === 'subscription_preapproval') {
			try {
				const preapproval = await new PreApproval(mercadopago).get({
					id: payment_id,
				})

				// Si se aprueba, actualizamos el usuario con el id de la suscripción
				if (preapproval.status === 'authorized') {
					// Actualizamos el usuario con el id de la suscripción
					console.log('Pago aprobado', preapproval)
					const userId = preapproval.external_reference

					const user = await this.userService.getById(userId)
					await this.paymentService.create({
						date: preapproval.date_created,
						amount: preapproval.auto_recurring.transaction_amount,
						payment_by: user.id,
						payment_method: 'Mercado Pago',
						start_date: preapproval.date_created,
						end_date: preapproval.next_payment_date,
						EnterpriseId: user.EnterpriseId,
						status: PaymentStatus.PAID,
					})
					// A PARTIR DE ACA HAY QUE CREAR EL PAGO CON LOS DATOS REFERENCIADOS A LA EMPRESA!
				}

				// Acá podés:
				// - Actualizar la DB del usuario
				// - Confirmar la suscripción
				// - Enviar email, etc.
			} catch (err) {
				console.error('Error at webhook mercadopago:', err)
			}
		}
	}
}
