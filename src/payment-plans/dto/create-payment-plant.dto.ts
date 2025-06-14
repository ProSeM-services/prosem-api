import { createZodDto } from '@anatine/zod-nestjs'
import { PaymentPlanSchema } from '../schema/payment-plan.zod'

export class CreatePaymentPlanDTO extends createZodDto(PaymentPlanSchema) {}
