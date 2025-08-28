import { z } from 'zod'
import { ENTERPRISE_STATUS_VALUES } from '../constants/enterprise-status.constants'

export const EnterpriseSchema = z.object({
	name: z.string(),
	email: z.string().email('Invalid email format').optional(),
	address: z.string(),
	company_count: z.number(),
	membership_price: z.number().optional(),
	company_limit: z.number().optional(),
	payment_plan: z.string().optional(),
	status: z.enum(ENTERPRISE_STATUS_VALUES),
})

export type IEnterprise = z.infer<typeof EnterpriseSchema>
