import { ROLES_VALUES } from 'src/core/types/role'
import { WorkhourZodSchema } from 'src/core/types/workhours'
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
	emailConfirmed: z.boolean().optional(),
	confirmationToken: z.string().optional(),
	confirmationTokenExpiresAt: z.date().optional(),
	workhours: z.array(WorkhourZodSchema).optional(),
})
export const UpdateUserZodSchema = z.object({
	name: z.string().optional(),
	lastName: z.string().optional(),
	userName: z.string().optional(),
	password: z.string().optional(),
	email: z.string().email().optional(),
	role: z.enum(ROLES_VALUES).optional(),
	companyName: z.string().optional(),
	tenantName: z.string().optional(),
	phone: z.string().optional(),
	image: z.string().optional(),
	workhours: z.array(WorkhourZodSchema).optional(),
})
export type IUser = z.infer<typeof UserZodSchema>
export type IUpdateUser = z.infer<typeof UpdateUserZodSchema>
