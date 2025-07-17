import { z } from 'zod'
import { BilingSchema } from '../types/billingCycle'
import { SubscriptionStatusSchema } from '../types/subscriptionStatus'

export const SubscriptionSchema = z.object({
	id: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	EnterpriseId: z.string(),
	PlanId: z.string(),
	amount: z.number(),
	discountApplied: z.number(),
	status: SubscriptionStatusSchema,
	billingCycle: BilingSchema,
})
export type ISubscription = z.infer<typeof SubscriptionSchema>
export const CreateSubscriptionSchema = SubscriptionSchema.omit({
	id: true,
}).optional()
export type ICreateSubscription = z.infer<typeof SubscriptionSchema>
