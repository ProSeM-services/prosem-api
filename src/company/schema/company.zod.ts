import { z } from 'zod'

// Validation for Company Model
export const CompanyZodSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	email: z.string().email(),
	address: z.string(),
	image: z.string().optional(),
})
export const UpdateCompanyZodSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	address: z.string().optional(),
	image: z.string().optional(),
})
