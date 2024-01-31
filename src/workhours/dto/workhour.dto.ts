import {
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateIf,
	ArrayNotEmpty,
} from 'class-validator'
export class WorkhourDto {
	@IsNumber()
	@IsNotEmpty()
	day: number

	@IsNotEmpty()
	@ArrayNotEmpty()
	hours: string[]

	@IsString()
	@ValidateIf((obj) => obj.UserId === undefined)
	@IsNotEmpty()
	CompanyId: string | null

	@IsString()
	@ValidateIf((obj) => obj.CompanyId === undefined)
	@IsNotEmpty()
	UserId: string | null
}
