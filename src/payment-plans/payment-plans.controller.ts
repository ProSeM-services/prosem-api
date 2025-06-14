import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common'
import { PaymentPlansService } from './payment-plans.service'
import { CreatePaymentPlanDTO } from './dto/create-payment-plant.dto'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { Role } from 'src/auth/decorators/roles.decorators'

@Controller('payment-plans')
@UseGuards(AuthGuard)
export class PaymentPlansController {
	constructor(private readonly paymentPlansService: PaymentPlansService) {}

	@Get()
	async getAllPaymentPlans() {
		try {
			return await this.paymentPlansService.getAll()
		} catch (error) {
			throw error
		}
	}

	@Role('MASTER')
	@Post()
	async createPaymentPlan(@Body() createPaymentPlanDTO: CreatePaymentPlanDTO) {
		try {
			const existingPlan = await this.paymentPlansService.getPlanByName(
				createPaymentPlanDTO.name
			)
			if (existingPlan) {
				throw new UnauthorizedException(
					`Ya extiste el plan con el nomre: ${createPaymentPlanDTO.name} `
				)
			}
			return await this.paymentPlansService.create(createPaymentPlanDTO)
		} catch (error) {
			throw error
		}
	}
	@Patch('/:id')
	async updatePaymentPlan(
		@Body() updatePaymentPlanDTO: CreatePaymentPlanDTO,
		@Param('id') id: string
	) {
		try {
			return await this.paymentPlansService.update(id, updatePaymentPlanDTO)
		} catch (error) {
			throw error
		}
	}

	@Delete('/:id')
	async deletePaymentPlan(@Param('id') id: string) {
		try {
			await this.paymentPlansService.delete(id)
			return { message: 'Payment plan deleted successfully' }
		} catch (error) {
			throw error
		}
	}
}
