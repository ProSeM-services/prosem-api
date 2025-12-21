import { createZodDto } from '@anatine/zod-nestjs'
import { AbsenceZodSchema } from '../schema/absence.zod'

export class AbsenceDTO extends createZodDto(AbsenceZodSchema) {}
