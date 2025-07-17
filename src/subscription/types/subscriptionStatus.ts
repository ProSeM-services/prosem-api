import { z } from 'zod'

export const SUBSCRIPTION_STATUS_OPTIONS = [
	'active',
	'expired',
	'canceled',
] as const

export const SubscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUS_OPTIONS)
export type TSubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>
