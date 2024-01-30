import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator'
export class WorkhourDto {
	@IsNumber()
	@IsNotEmpty()
	day: number

	@IsNotEmpty()
	hours: string[]

	@IsString()
	@ValidateIf((obj) => obj.userId === undefined)
	@IsNotEmpty()
	companyId: string

	@IsString()
	@ValidateIf((obj) => obj.companyId === undefined)
	@IsNotEmpty()
	userId: string
}
