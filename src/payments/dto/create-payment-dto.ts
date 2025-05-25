import { createZodDto } from '@anatine/zod-nestjs'
import { CreatePaymentSchema } from '../schema/payment.zod'

export class CreatePaymentDto extends createZodDto(CreatePaymentSchema) {}
