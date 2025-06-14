import { PAYMENT_PLAN_REPOSITORY } from 'src/core/constants'
import { PaymentPlan } from './schema/payment-plan.model'

export const paymentPlansProvider = [
	{
		provide: PAYMENT_PLAN_REPOSITORY,
		useValue: PaymentPlan,
	},
]
