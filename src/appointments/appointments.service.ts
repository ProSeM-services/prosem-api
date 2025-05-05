import { Inject, Injectable } from '@nestjs/common'
import { APPOINTMENT_REPOSITORY } from 'src/core/constants'
import { Appointment } from './schema/appointment.model'
import { AppointmentDTO } from './dto/appointment.dto'
import { User } from 'src/user/schema/user.model'
import { Service } from 'src/services/schema/service.model'
@Injectable()
export class AppointmentsService {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY)
		private readonly AppointmentModel: typeof Appointment
	) {}
	async getAll(EnterpriseId: string, limit: number = 10, page: number = 1) {
		const offset = (page - 1) * limit
		const [appointments, total] = await Promise.all([
			this.AppointmentModel.findAll({
				where: {
					EnterpriseId,
				},
				include: [User],
				limit: limit,
				offset: offset,
				order: [['createdAt', 'DESC']],
			}),
			this.AppointmentModel.count({
				where: {
					EnterpriseId,
				},
			}),
		])

		return {
			appointments,
			total,
			limit,
			offset,
			page,
		}
	}

	async getById(id: string) {
		return await this.AppointmentModel.findOne({
			where: { id },
			include: [User, Service],
		})
	}
	async getByService(tenantName: string, ServiceId: string) {
		return await this.AppointmentModel.findAll({
			where: { tenantName, ServiceId },
		})
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
	async getByCancelationToken(cancelationToken: string) {
		return this.AppointmentModel.findOne({
			where: { cancelationToken },
			include: [User, Service],
		})
	}
	async getByCustomer(CustomerId: string) {
		return this.AppointmentModel.findAll({ where: { CustomerId } })
	}
	async cancelAppointment(appointment: Appointment) {
		appointment.canceled = true
		await appointment.save()
	}

	async update(id: string, data: Partial<AppointmentDTO>) {
		return await this.AppointmentModel.update(data, { where: { id } })
	}
}
