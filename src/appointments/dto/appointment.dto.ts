import { IsNotEmpty, IsString, Validate } from 'class-validator'
function isValidISOString(date: string): boolean {
	return new Date(date).toISOString() === date
}
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
	@Validate(
		(value: string) => {
			console.log('DENTRO DEL DTO', { value, validator: isValidISOString(value) })
			return isValidISOString(value)
		},
		{
			message: 'La fecha debe estar en formato ISO8601 (toISOString)',
		}
	)
	date: string
	@IsString()
	@IsNotEmpty()
	time: string
	@IsString()
	@IsNotEmpty()
	UserId: string
}
