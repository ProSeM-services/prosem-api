import { createZodDto } from '@anatine/zod-nestjs'
import {
	NewUserSchema,
	UpdateUserZodSchema,
	UserZodSchema,
} from '../schema/user.zod'
export class UserDTO extends createZodDto(UserZodSchema) {}
export class UpdateUserDTO extends createZodDto(UpdateUserZodSchema) {}
export class RegisterUserDTO extends createZodDto(NewUserSchema) {}
