import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Payment } from './schema/payment.model'
import { PAYMENT_REPOSITORY } from 'src/core/constants'
import { PaymentStatus } from './constants/payment-status'

@Injectable()
export class PaymentsService {
	constructor(
		@Inject(PAYMENT_REPOSITORY) private readonly paymentModel: typeof Payment
	) {}
	private payments: Payment[] = []
	private idCounter = 1

	async create(paymentData: Partial<Payment>) {
		return await this.paymentModel.create(paymentData)
	}

	async findAll() {
		return await this.paymentModel.findAll()
	}

	async findOne(id: string) {
		return await this.paymentModel.findOne({ where: { id } })
	}

	async update(id: number, updateData: Partial<Omit<Payment, 'id'>>) {}

	async remove(id: number) {}

	async findLastPaidByEnterprise(EnterpriseId: string): Promise<Payment | null> {
		return await this.paymentModel.findOne({
			where: {
				EnterpriseId,
				status: PaymentStatus.PAID,
			},
			order: [['end_date', 'DESC']],
		})
	}
}
