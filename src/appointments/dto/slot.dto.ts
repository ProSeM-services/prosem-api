import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateSlotDTO {
	@IsString()
	@IsOptional()
	date: string
	@IsString()
	@IsOptional()
	time: string
	@IsString()
	@IsOptional()
	UserId: string
	@IsBoolean()
	@IsOptional()
	avaliable: boolean
}
