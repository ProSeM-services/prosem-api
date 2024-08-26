import { createZodDto } from '@anatine/zod-nestjs'
import { UpdateUserZodSchema, UserZodSchema } from '../schema/user.zod'
export class UserDTO extends createZodDto(UserZodSchema) {}
export class UpdateUserDTO extends createZodDto(UpdateUserZodSchema) {}
