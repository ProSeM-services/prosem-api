import { z } from 'zod'

const dateSchema = z
	.string()
	.trim()
	.refine((value) => !Number.isNaN(Date.parse(value)), {
		message: 'Date must be valid.',
	})

export const AbsenceZodSchema = z
	.object({
		startDate: dateSchema,
		endDate: dateSchema,
		reason: z.string().optional(),
		UserId: z.string().min(1),
		EnterpriseId: z.string().optional(),
	})
	.refine(
		({ startDate, endDate }) =>
			new Date(startDate).getTime() <= new Date(endDate).getTime(),
		{
			message: 'endDate must be greater than or equal to startDate.',
			path: ['endDate'],
		}
	)

export type AbsenceInput = z.infer<typeof AbsenceZodSchema>
