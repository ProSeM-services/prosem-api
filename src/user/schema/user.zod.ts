import { ROLES_VALUES } from 'src/core/types/role'
import { WorkhourZodSchema } from 'src/core/types/workhours'
import { z } from 'zod'
import { Permission } from 'src/core/types/permissions'
import { ACCOUNT_TYPE_VALUES } from 'src/core/types/accout-type'
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
	membership_status: z.boolean().optional(),
	confirmationToken: z.string().optional(),
	confirmationTokenExpiresAt: z.date().optional(),
	workhours: z.array(WorkhourZodSchema).optional(),
	permissions: z
		.array(z.nativeEnum(Permission), { message: 'El permiso no es válido' })
		.optional(),
})
export const NewUserSchema = z.object({
	name: z.string().min(1),
	lastName: z.string().min(1),
	userName: z.string().min(1),
	password: z.string().min(1),
	email: z.string().min(1),
	phone: z.string().optional(),
	image: z.string().optional(),
})
export const UpdateUserZodSchema = z.object({
	name: z.string().optional(),
	lastName: z.string().optional(),
	userName: z.string().optional(),
	membership_status: z.boolean().optional(),
	password: z.string().optional(),
	email: z.string().email().optional(),
	role: z.enum(ROLES_VALUES).optional(),
	companyName: z.string().optional(),
	tenantName: z.string().optional(),
	phone: z.string().optional().nullable(),
	image: z.string().optional(),
	workhours: z.array(WorkhourZodSchema).optional(),
	account_type: z.enum(ACCOUNT_TYPE_VALUES).optional(),
	permissions: z
		.array(z.nativeEnum(Permission), { message: 'El permiso no es válido' })
		.optional(),
})
export type IUser = z.infer<typeof UserZodSchema>
export type IUpdateUser = z.infer<typeof UpdateUserZodSchema>
export type INewUser = z.infer<typeof NewUserSchema>
