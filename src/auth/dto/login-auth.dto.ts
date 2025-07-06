import { AuthBodySchema } from '../interface/auth.interface'
import { createZodDto } from '@anatine/zod-nestjs'

export class LoginAuthDto extends createZodDto(AuthBodySchema) {}
