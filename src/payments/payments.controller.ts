import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Request,
	UnauthorizedException,
	Body,
} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { PaymentsService } from './payments.service'
import { Request as ExpressRequest } from 'express'
import { CreatePaymentDto } from './dto/create-payment-dto'
import { UserService } from 'src/user/user.service'
import { Payment } from './schema/payment.model'
@Controller('payments')
export class PaymentsController {
	constructor(
		private readonly appointmentService: PaymentsService,
		private readonly enterpriseService: EnterpriseService,
		private readonly userService: UserService,
		private authService: AuthService
	) {}

	@Get()
	async getAllPayments(@Request() req: ExpressRequest) {
		try {
			const tokenDAta = await this.authService.getDataFromToken(req)

			const { EnterpriseId } = tokenDAta
			if (!EnterpriseId) {
				throw new UnauthorizedException('Missing or invalid token')
			}
			const payments = await this.appointmentService.findAll()
			return payments
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
				throw new UnauthorizedException('Missing or invalid token')
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
			endDate.setMonth(endDate.getMonth() + 1)

			const paymentData: Partial<Payment> = {
				...body,
				EnterpriseId,
				payment_by,
				end_date: endDate.toISOString(),
			}
			const payment = await this.appointmentService.create(paymentData)
			return payment
		} catch (error) {
			console.error('Error fetching payments:', error)
			throw error
		}
	}
}
