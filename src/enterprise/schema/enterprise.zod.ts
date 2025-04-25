import { z } from 'zod'

export const EnterpriseSchema = z.object({
	name: z.string(),
	email: z.string().email('Invalid email format').optional(),
	address: z.string(),
	company_count: z.number(),
})

export type IEnterprise = z.infer<typeof EnterpriseSchema>
