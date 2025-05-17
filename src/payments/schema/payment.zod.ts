import { z } from 'zod'
import { PaymentStatus } from '../constants/payment-status'
const isoStringRegex =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/

const paymentStatusValues = Object.values(PaymentStatus) as [
	string,
	...string[],
]

export const CreatePaymentSchema = z.object({
	date: z
		.string()
		.trim()
		.refine((value) => isoStringRegex.test(value), {
			message: 'Date must be a valid ISO 8601 string including time and timezone',
		}),
	amount: z.number().min(1),
	image: z.string(),
	start_date: z
		.string()
		.trim()
		.refine((value) => isoStringRegex.test(value), {
			message: 'Date must be a valid ISO 8601 string including time and timezone',
		}),
	payment_method: z.string().optional(),
	notes: z.string().optional(),
})

export type ICreatePayment = z.infer<typeof CreatePaymentSchema>
