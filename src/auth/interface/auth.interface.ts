import { z } from 'zod'

export const PayloadTokenSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	lastName: z.string(),
	role: z.string(),
	userName: z.string(),
	image: z.string(),
	tenantName: z.string(),
	companyName: z.string(),
})

export const AuthBodySchema = z.object({
	user: z.string(),
	password: z.string(),
})

export const AuthResponseSchema = z.object({
	accessToken: z.string(),
	user: PayloadTokenSchema,
})

export const UseTokenSchema = z.object({
	role: z.string(),
	sub: z.string(),
	isExpired: z.boolean(),
})

export type IPayloadToken = z.infer<typeof PayloadTokenSchema>
export type IAuthBody = z.infer<typeof AuthBodySchema>
export type IAuthResponse = z.infer<typeof AuthResponseSchema>
export type IUseToken = z.infer<typeof UseTokenSchema>
