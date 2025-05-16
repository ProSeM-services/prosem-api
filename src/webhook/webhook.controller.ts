import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common'
import axios from 'axios'
import { Request, Response } from 'express'

@Controller('webhooks')
export class WebhookController {
	@Post('mercadopago')
	@HttpCode(200) // Importante: siempre responder con 200 OK para que MP no reintente
	async handleMercadoPago(@Req() req: Request, @Res() res: Response) {
		const { type, id } = req.body
		console.log('body: :', req.body)
		// const id = req.query['data.id'] || req.query['data.id']?.toString()

		console.log(`Webhook recibido: ${type} con ID: ${id}`)
		if (type === 'subscription_preapproval') {
			try {
				const paymentInfo = await axios.get(
					`https://api.mercadopago.com/v1/payments/${id}`,
					{
						headers: {
							Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, // No uses el de prueba si estás en prod
						},
					}
				)

				console.log('📦 Info del pago recibido:', paymentInfo.data)

				// Acá podés:
				// - Actualizar la DB del usuario
				// - Confirmar la suscripción
				// - Enviar email, etc.
			} catch (err) {
				console.error('❌ Error al consultar el pago:', err.response?.data || err)
			}
		}
		// Acá luego vas a hacer algo como: consultar MP con ese ID
		// Por ahora, solo respondemos
		return res.send('OK')
	}
}
