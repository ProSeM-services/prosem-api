import { ROLES_VALUES } from 'src/core/types/role'
import { z } from 'zod'

export const UserZodSchema = z.object({
	name: z.string().min(1),
	lastName: z.string().min(1),
	userName: z.string().min(1),
	password: z.string().min(1),
	email: z.string().min(1),
	role: z.enum(ROLES_VALUES),
	companyName: z.string().optional(),
	tenantName: z.string().optional(),
	phone: z.string().optional(),
	image: z.string().optional(),
})
export const UpdateUserZodSchema = UserZodSchema.optional()
export type IUser = z.infer<typeof UserZodSchema>
export type IUpdateUser = z.infer<typeof UpdateUserZodSchema>
