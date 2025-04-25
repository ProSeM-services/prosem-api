import { createZodDto } from '@anatine/zod-nestjs'
import { EnterpriseSchema } from '../schema/enterprise.zod'

export class CreateEnterpriseDto extends createZodDto(EnterpriseSchema) {}
