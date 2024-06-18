import { createZodDto } from '@anatine/zod-nestjs'
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'
import { UserZodSchema } from './user.zod'
export class UserDTO extends createZodDto(UserZodSchema) {}

export class UpdateUserDTO {
	@IsString()
	@IsOptional()
	name: string
	@IsString()
	@IsOptional()
	lastName: string
	@IsString()
	@IsOptional()
	userName: string
	@IsString()
	@IsOptional()
	password: string
	@IsString()
	@IsOptional()
	@IsEmail()
	email: string
	@IsString()
	@IsOptional()
	image: string
	@IsString()
	@IsOptional()
	phone: string
	@IsString()
	@IsOptional()
	role: string
}
