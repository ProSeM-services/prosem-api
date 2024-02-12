import {
	IsNotEmpty,
	IsString,
	ValidateIf,
	ArrayNotEmpty,
	IsOptional,
} from 'class-validator'
export class UpdateWorkHourDto {
	@IsNotEmpty()
	@ArrayNotEmpty()
	hours: string[]

	@IsString()
	@ValidateIf((obj) => obj.UserId === undefined)
	@IsOptional()
	CompanyId: string | null

	@IsString()
	@ValidateIf((obj) => obj.CompanyId === undefined)
	@IsOptional()
	UserId: string | null
}
