import { z } from 'zod'
const isoStringRegex =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/

export const AppointmentZodSchema = z.object({
	name: z.string().min(1),
	lastName: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(1),
	time: z.string().min(1),
	price: z.number().optional(),
	confirmed: z.boolean().optional(),
	payment_method: z.string().optional(),
	cancelationToken: z.string().optional(),
	duration: z.number().optional(),
	date: z
		.string()
		.trim()
		.refine((value) => isoStringRegex.test(value), {
			message: 'Date must be a valid ISO 8601 string including time and timezone',
		}),
	UserId: z.string().min(1),
	ServiceId: z.string().min(1),
	CustomerId: z.string().optional(),
	tenantName: z.string().optional(),
	companyId: z.string().optional(),
	canceled: z.boolean().optional(),
	EnterpriseId: z.string().optional(),
})

export const SlotsZodSchmea = z.object({
	date: z
		.string()
		.trim()
		.refine((value) => isoStringRegex.test(value), {
			message: 'Date must be a valid ISO 8601 string including time and timezone',
		}),
	UserId: z.string().min(1),
	duration: z.number(),
})
export const CancelAppointmentZodSchema = z.object({
	UserId: z.string().min(1),
	appointmemntId: z.string().min(1),
})

export type IAppointment = z.infer<typeof AppointmentZodSchema>
