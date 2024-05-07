import { createZodDto } from '@anatine/zod-nestjs'
import { CompanyZodSchema, UpdateCompanyZodSchema } from '../schema/company.zod'

export class CompanyDTO extends createZodDto(CompanyZodSchema) {}
export class UpdateCompanyDTO extends createZodDto(UpdateCompanyZodSchema) {}
