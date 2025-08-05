import {
	Controller,
	Post,
	Req,
	HttpCode,
	UnauthorizedException,
} from '@nestjs/common'

import { PreApproval } from 'mercadopago'
import { mercadopago } from 'src/core/config/mercadopago'
import { Request as ExpressRequest } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { PaymentsService } from 'src/payments/payments.service'
import { PaymentStatus } from 'src/payments/constants/payment-status'
import { SubscriptionService } from 'src/subscription/subscription.service'
import { NotificactionsService } from 'src/notificactions/notificactions.service'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
@Controller('webhooks')
export class WebhookController {
	constructor(
		private authService: AuthService,
		private readonly userService: UserService,
		private readonly paymentService: PaymentsService,
		private readonly subscriptionService: SubscriptionService,
		private readonly notificationService: NotificactionsService,
		private readonly enterpriseService: EnterpriseService
	) {}
	@Post('mercadopago')
	@HttpCode(200) // MP necesita 200 OK para no reintentar
	async subscribe(@Req() req: ExpressRequest) {
		const { type, data } = req.body
		const { id: payment_id } = data
		console.log('WEBHOOK :: mercadopago > BODY', req.body)
		if (type === 'subscription_preapproval') {
			console.log('type', type)
			try {
				const preapproval = await new PreApproval(mercadopago).get({
					id: payment_id,
				})

				if (preapproval.status === 'authorized') {
					console.log('Pago aprobado', preapproval)

					// Obtenemos el usuario (en external_reference guardaste el userId)
					const userId = preapproval.external_reference
					const user = await this.userService.getById(userId)

					if (!user || !user.EnterpriseId) {
						console.warn('User or Enterprise not found for payment')
						return
					}
					const validEnterprise = await this.enterpriseService.findOne(
						user.EnterpriseId
					)
					if (!validEnterprise) {
						throw new UnauthorizedException('Enterprise not found')
					}
					// --- 1. Crear el pago ---
					const startDate = new Date(preapproval.date_created)
					const endDate = new Date(startDate)
					endDate.setMonth(endDate.getMonth() + 1)

					// Detectamos el ciclo (ej: mensual)
					const frequency = preapproval.auto_recurring.frequency_type // months, days, etc.

					const payment = await this.paymentService.create({
						date: preapproval.date_created,
						amount: preapproval.auto_recurring.transaction_amount,
						payment_by: user.id,
						payment_method: 'Mercado Pago',
						start_date: startDate.toISOString(),
						end_date: endDate.toISOString(),
						EnterpriseId: user.EnterpriseId,
						status: PaymentStatus.PAID,
					})

					await this.notificationService.create({
						title: 'Nuevo pago recibido',
						message: `El cliente ${validEnterprise.name} realizó un pago de $${payment.amount}`,
						relatedEntityId: payment.id,
						EnterpriseId: payment.EnterpriseId,
						type: 'payment',
						read: false,
					})
					// --- 2. Crear o actualizar la suscripción ---
					const subscription =
						await this.subscriptionService.getSubscriptionByEnterpriseId(
							user.EnterpriseId
						)
					const billingCycle = 'monthly' // TODO: INCLUIR  body.billingCycle
					const monthsToAdd =
						billingCycle === 'monthly' ? 1 : billingCycle === 'quarterly' ? 3 : 12
					if (subscription) {
						// actualizar subscrition

						console.log('ACTUALIZAR SUBSCRIPTION')
						// Extender suscripción existente si sigue activa
						const currentEnd = new Date(subscription.endDate)
						const now = new Date()
						// Si la suscripción sigue activa, extendemos desde el endDate actual
						const baseDate = currentEnd >= now ? currentEnd : now
						baseDate.setMonth(baseDate.getMonth() + monthsToAdd)

						await subscription.update({
							endDate: baseDate.toISOString(),
							status: 'active',
							amount: (subscription.amount || 0) + payment.amount,
						})
					} else {
						// crear subscrition
						console.log('CREAR SUBSCRIPTION')
						await this.subscriptionService.createSubscription({
							billingCycle,
							startDate: startDate.toISOString(),
							endDate: endDate.toISOString(),
							amount: payment.amount,
							discountApplied: 0,
							EnterpriseId: user.EnterpriseId,
						})
					}
				}
			} catch (err) {
				console.error('Error at webhook mercadopago:', err)
			}
		}
	}
}
