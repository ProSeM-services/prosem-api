import { PAYMENT_REPOSITORY } from 'src/core/constants'
import { Payment } from './schema/payment.model'

export const paymentProvider = [
	{
		provide: PAYMENT_REPOSITORY,
		useValue: Payment,
	},
]
