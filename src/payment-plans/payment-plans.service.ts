import { Inject, Injectable } from '@nestjs/common'
import { PAYMENT_PLAN_REPOSITORY } from 'src/core/constants'
import { PaymentPlan } from './schema/payment-plan.model'

@Injectable()
export class PaymentPlansService {
	constructor(
		@Inject(PAYMENT_PLAN_REPOSITORY)
		private readonly PaymentPlanModel: typeof PaymentPlan
	) {}

	async getAll(): Promise<PaymentPlan[]> {
		return this.PaymentPlanModel.findAll()
	}
	async getById(id: string): Promise<PaymentPlan> {
		return this.PaymentPlanModel.findOne({
			where: { id },
		})
	}
	async create(paymentPlan: Partial<PaymentPlan>): Promise<PaymentPlan> {
		return this.PaymentPlanModel.create(paymentPlan)
	}
	async update(
		id: string,
		paymentPlan: Partial<PaymentPlan>
	): Promise<[number, PaymentPlan[]]> {
		return this.PaymentPlanModel.update(paymentPlan, {
			where: { id },
			returning: true,
		})
	}
	async delete(id: string): Promise<void> {
		const paymentPlan = await this.getById(id)
		if (!paymentPlan) {
			throw new Error('Payment plan not found')
		}
		await paymentPlan.destroy()
	}
	async getActivePlans(): Promise<PaymentPlan[]> {
		return this.PaymentPlanModel.findAll({
			where: { isActive: true },
		})
	}
	async getInactivePlans(): Promise<PaymentPlan[]> {
		return this.PaymentPlanModel.findAll({
			where: { isActive: false },
		})
	}

	async getPlanByName(name: string): Promise<PaymentPlan> {
		return this.PaymentPlanModel.findOne({
			where: { name },
		})
	}
}
