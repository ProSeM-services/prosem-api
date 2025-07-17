import { createZodDto } from '@anatine/zod-nestjs'
import { CreateSubscriptionSchema } from '../schema/subscription.schema'

export class CreateSubscriptionDTO extends createZodDto(
	CreateSubscriptionSchema
) {}
