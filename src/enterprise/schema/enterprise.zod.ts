import { z } from 'zod'

export const EnterpriseSchema = z.object({
	name: z.string(),
	address: z.string(),
	email: z.string().email('Invalid email format').optional(),
})

export type IEnterprise = z.infer<typeof EnterpriseSchema>
