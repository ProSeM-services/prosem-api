import { AppointmentZodSchema } from 'src/appointments/schema/appointment.zod'
import { z } from 'zod'

export const CustomerZodSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	tenantName: z.string().optional(),
	email: z.string(),
	phone: z.string(),
	EnterpriseId: z.string(),
	apointments: z.array(AppointmentZodSchema),
})
export const CreateCustomerZodSchema = CustomerZodSchema.omit({
	id: true,
	apointments: true,
})
export const UpdateCustomerZodSchema = CustomerZodSchema.omit({
	id: true,
	apointments: true,
}).optional()

export type ICustomer = z.infer<typeof CustomerZodSchema>
export type ICreateCustomer = z.infer<typeof CreateCustomerZodSchema>
export type IUpdateCustomer = z.infer<typeof UpdateCustomerZodSchema>
