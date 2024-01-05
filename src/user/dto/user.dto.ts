import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'
export class UserDTO {
	@IsString()
	@IsNotEmpty()
	name: string
	@IsString()
	@IsNotEmpty()
	lastName: string
	@IsString()
	@IsNotEmpty()
	userName: string
	@IsString()
	@IsNotEmpty()
	password: string
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
	@IsString()
	@IsOptional()
	image: string
}
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
}
