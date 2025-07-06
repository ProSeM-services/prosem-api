import { createZodDto } from '@anatine/zod-nestjs'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { SlotsZodSchmea } from '../schema/appointment.zod'

export class SlotAppointmentDTO extends createZodDto(SlotsZodSchmea) {}
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
