import { IsNotEmpty, IsString } from 'class-validator'

export class AppointmentDTO {
	@IsString()
	@IsNotEmpty()
	name: string
	@IsString()
	@IsNotEmpty()
	lastName: string
	@IsString()
	@IsNotEmpty()
	phone: string
	@IsString()
	@IsNotEmpty()
	email: string
	@IsString()
	@IsNotEmpty()
	date: string
	@IsString()
	@IsNotEmpty()
	time: string
	@IsString()
	@IsNotEmpty()
	UserId: string
}
