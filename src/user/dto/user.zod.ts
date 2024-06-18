import { z } from 'zod'

export const UserZodSchema = z.object({
	CompanyId: z.string(),
	name: z.string(),
	lastName: z.string(),
	userName: z.string(),
	password: z.string(),
	email: z.string(),
	role: z.string(),
	phone: z.string().optional(),
	image: z.string().optional(),
})
