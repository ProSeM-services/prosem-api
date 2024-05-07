import { Inject, Injectable } from '@nestjs/common'
import {
	APPOINTMENTSLOTS_REPOSITORY,
	APPOINTMENT_REPOSITORY,
} from 'src/core/constants'
import { Appointment } from './schema/appointment.model'
import { AppointmentDTO } from './dto/appointment.dto'
import { AppoinmentSlots } from './schema/appointmentSlots.model'
import { UpdateSlotDTO } from './dto/slot.dto'

@Injectable()
export class AppointmentsService {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY)
		private readonly AppointmentModel: typeof Appointment,
		@Inject(APPOINTMENTSLOTS_REPOSITORY)
		private readonly SlotModel: typeof AppoinmentSlots
	) {}

	async getAll() {
		return await this.AppointmentModel.findAll()
	}
	async getSlots() {
		return await this.SlotModel.findAll()
	}
	async getById(id: string) {
		return await this.AppointmentModel.findOne({ where: { id } })
	}
	async create(data: AppointmentDTO) {
		return await this.AppointmentModel.create(data)
	}

	async delete(id: string) {
		return await this.AppointmentModel.destroy({ where: { id } })
	}
	async checkSlot({ date, time, UserId }: AppointmentDTO) {
		return await this.SlotModel.findOne({
			where: {
				date,
				time,
				UserId,
			},
		})
	}
	async getSlotsByDateAndBarber({
		UserId,
		date,
	}: {
		UserId: string
		date: string
	}) {
		return await this.SlotModel.findAll({
			where: {
				date,
				UserId,
			},
		})
	}
	async editSlot(slotId: string, data: UpdateSlotDTO) {
		return await this.SlotModel.update(data, { where: { id: slotId } })
	}

	async createSlot({ date, time, UserId }: AppointmentDTO) {
		return await this.SlotModel.create({
			date,
			time,
			UserId,
			avaliable: false,
		})
	}
}
