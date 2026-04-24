import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Request,
	UnauthorizedException,
	Body,
	Param,
	Inject,
} from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { AuthService } from 'src/auth/auth.service'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { PaymentsService } from './payments.service'
import { Request as ExpressRequest } from 'express'
import { CreatePaymentDto } from './dto/create-payment-dto'
import { UserService } from 'src/user/user.service'
import { Payment } from './schema/payment.model'
import { NotificactionsService } from 'src/notificactions/notificactions.service'
import { PreApproval } from 'mercadopago'
import { mercadopago } from 'src/core/config/mercadopago'
import { SubscriptionService } from 'src/subscription/subscription.service'
@Controller('payments')
export class PaymentsController {
	constructor(
		private readonly appointmentService: PaymentsService,
		private readonly enterpriseService: EnterpriseService,
		private readonly userService: UserService,
		private authService: AuthService,
		private readonly notificationService: NotificactionsService,
		private readonly subscriptionService: SubscriptionService,
		@Inject('SEQUELIZE') private readonly sequelize: Sequelize,
	) {}

	@Get()
	async getAllPayments(@Request() req: ExpressRequest) {
		try {
			const tokenDAta = await this.authService.getDataFromToken(req)

			const { EnterpriseId, role } = tokenDAta
			if (!EnterpriseId) {
				throw new UnauthorizedException('Missing or invalid token')
			}

			if (role !== 'MASTER') {
				return await this.appointmentService.findAll(EnterpriseId)
			}
			return await this.appointmentService.findAll()
		} catch (error) {
			console.error('Error fetching payments:', error)
			throw error
		}
	}

	@Get('/last-payment')
	async getLastPayment(@Request() req: ExpressRequest) {
		try {
			const tokenDAta = await this.authService.getDataFromToken(req)

			const { EnterpriseId } = tokenDAta
			if (!EnterpriseId) {
				throw new UnauthorizedException('Missing or invalid token')
			}
			return await this.appointmentService.findLastPaidByEnterprise(EnterpriseId)
		} catch (error) {
			console.error('Error fetching payments:', error)
			throw error
		}
	}
	@Post()
	async createPayment(
		@Request() req: ExpressRequest,
		@Body() body: CreatePaymentDto
	) {
		try {
			const { EnterpriseId, id: payment_by } =
				await this.authService.getDataFromToken(req)
			if (!EnterpriseId || !payment_by) {
				throw new UnauthorizedException('Missing or invalid token!')
			}

			const validUser = await this.userService.getById(payment_by)
			if (!validUser) {
				throw new UnauthorizedException('User not found')
			}

			const validEnterprise = await this.enterpriseService.findOne(EnterpriseId)
			if (!validEnterprise) {
				throw new UnauthorizedException('Enterprise not found')
			}

			const startDate = new Date(body.start_date)
			const endDate = new Date(startDate)
			const billingCycle = body.billingCycle ?? 'monthly'
			const monthsToAdd =
				billingCycle === 'monthly' ? 1 : billingCycle === 'quarterly' ? 3 : 12
			endDate.setMonth(endDate.getMonth() + monthsToAdd)

			const paymentData: Partial<Payment> = {
				...body,
				EnterpriseId,
				payment_by,
				end_date: endDate.toISOString(),
			}

			const payment = await this.sequelize.transaction(async (t) => {
				const payment = await this.appointmentService.create(paymentData, t)

				const subscription =
					await this.subscriptionService.getSubscriptionByEnterpriseId(EnterpriseId)

				if (subscription) {
					const currentEnd = new Date(subscription.endDate)
					const now = new Date()
					const baseDate = currentEnd >= now ? currentEnd : now
					baseDate.setMonth(baseDate.getMonth() + monthsToAdd)

					await subscription.update(
						{
							endDate: baseDate.toISOString(),
							status: 'active',
							amount: (subscription.amount || 0) + body.amount,
						},
						{ transaction: t },
					)
				} else {
					await this.subscriptionService.createSubscription(
						{
							billingCycle,
							startDate: startDate.toISOString(),
							endDate: endDate.toISOString(),
							amount: body.amount,
							discountApplied: 0,
							EnterpriseId,
						},
						t,
					)
				}

				return payment
			})

			await this.notificationService.create({
				title: 'Nuevo pago recibido',
				message: `El cliente ${validEnterprise.name} realizó un pago de $${body.amount}`,
				relatedEntityId: payment.id,
				EnterpriseId: payment.EnterpriseId,
				type: 'payment',
				read: false,
			})

			return payment
		} catch (error) {
			console.error('Error fetching payments:', error)
			throw error
		}
	}

	@Post('/subscribe')
	async subscribe(
		@Request() req: ExpressRequest,
		@Body()
		body: { email: string; amount: number; frequency: number; plan_id: string }
	) {
		const { id: userId, email } = await this.authService.getDataFromToken(req)
		try {
			const externalReference = JSON.stringify({
				userId,
				planId: body.plan_id,
			})
			// : Enviar un JSON serializado
			console.log('Email', email)
			const preapproval = await new PreApproval(mercadopago).create({
				body: {
					back_url: process.env.WEB_BACKOFFICE_URL,
					reason: 'Suscripción a reserve pro',
					auto_recurring: {
						frequency: body.frequency,
						frequency_type: 'months',
						transaction_amount: body.amount,
						currency_id: 'ARS',
					},
					payer_email: email,
					status: 'pending',
					external_reference: externalReference,
				},
			})
			return { init_point: preapproval.init_point }
		} catch (error) {
			console.error('Error creating preapproval:', error)
			throw error
		}
	}

	@Patch('/:id')
	async updatePayment(
		@Param('id') id: string,
		@Request() req: ExpressRequest,
		@Body() body: Partial<CreatePaymentDto>
	) {
		try {
			const { role } = await this.authService.getDataFromToken(req)
			if (role !== 'MASTER') {
				throw new UnauthorizedException(
					'No tienes permisos para realizar esta acción'
				)
			}
			return await this.appointmentService.update(id, body)
		} catch (error) {
			console.error('Error fetching payments:', error)
			throw error
		}
	}
}
