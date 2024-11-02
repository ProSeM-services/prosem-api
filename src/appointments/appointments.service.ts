import { Inject, Injectable } from '@nestjs/common'
import { APPOINTMENT_REPOSITORY } from 'src/core/constants'
import { Appointment } from './schema/appointment.model'
import { AppointmentDTO } from './dto/appointment.dto'
import { User } from 'src/user/schema/user.model'
@Injectable()
export class AppointmentsService {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY)
		private readonly AppointmentModel: typeof Appointment
	) {}

	async getAll(token: string) {
		return await this.AppointmentModel.findAll({
			where: {
				tenantName: token,
			},
			include: [User],
		})
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

	async findByAppointmentInfo(data: {
		UserId: string
		time: string
		date: string
	}) {
		return this.AppointmentModel.findOne({ where: { ...data } })
	}

	async getByUser(UserId: string) {
		return this.AppointmentModel.findAll({ where: { UserId } })
	}
	async getByCustomer(CustomerId: string) {
		return this.AppointmentModel.findAll({ where: { CustomerId } })
	}
	async cancelAppointment(appointment: Appointment) {
		appointment.canceled = true
		await appointment.save()
	}
}
