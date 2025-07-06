import { z } from 'zod'

export const PaymentPlanSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	price: z.number().min(0, 'Price must be a positive number'),
	duration: z.number().int().min(1, 'Duration must be a positive integer'), // Duration in months or days
	company_limit: z.number().int().min(1, 'Duration must be a positive integer'), // Duration in months or days
	description: z.string().optional(),
	isActive: z.boolean().default(true), // Indicates if the payment plan is currently active
	createdAt: z.date().optional(),
})
export type PaymentPlan = z.infer<typeof PaymentPlanSchema>
