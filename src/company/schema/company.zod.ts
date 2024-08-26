import { z } from 'zod'
import { LocationZodSchema } from '../interfaces/location.interface'
import { CATEGORY_VALUES } from '../interfaces/categeory.interface'
import { WorkhourZodSchema } from 'src/core/types/workhours'
export const CompanyZodSchema = z.object({
	_id: z.string(),
	name: z.string(),
	address: LocationZodSchema,
	status: z.boolean().optional(),
	category: z
		.array(z.enum(CATEGORY_VALUES))
		.max(3, 'Puedes elegir como máximo 3 categorías.')
		.min(1, 'Debes elegir por lo menos 1 categoría.'),
	image: z.string().optional(),
	tenantName: z.string().optional(),
	email: z.string().email('Correo electrónico no válido').optional(),
	workhours: z.array(WorkhourZodSchema).optional(),
})
export const CreateCompanyZodSchema = CompanyZodSchema.omit({
	_id: true,
	workhours: true,
	address: true,
}).extend({
	address: z.string(),
})

export const UpdateCompanyZodSchema = CompanyZodSchema.partial()

export type ICompany = z.infer<typeof CompanyZodSchema>
export type ICreateCompany = z.infer<typeof CreateCompanyZodSchema>
