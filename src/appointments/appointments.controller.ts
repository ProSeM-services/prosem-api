import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	NotAcceptableException,
	UnauthorizedException,
	Delete,
	Param,
} from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentDTO } from './dto/appointment.dto'
import { UserService } from 'src/user/user.service'

@Controller('appointments')
export class AppointmentsController {
	constructor(
		private readonly appointmentService: AppointmentsService,
		private readonly userService: UserService
	) {}

	async checkOwner(data: AppointmentDTO) {
		if (data.UserId) {
			const user = await this.userService.getById(data.UserId)
			if (!user) {
				throw new NotFoundException('user not found')
			} else if (user.role !== 'employee') {
				throw new NotAcceptableException('user is not able to set appointment')
			}
		}
	}

	@Get()
	async getAll() {
		try {
			return await this.appointmentService.getAll()
		} catch (error) {
			return error
		}
	}
	@Get('/slots')
	async getSlots() {
		try {
			return await this.appointmentService.getSlots()
		} catch (error) {
			return error
		}
	}

	@Post()
	async create(@Body() data: AppointmentDTO) {
		try {
			await this.checkOwner(data)
			const checkSlot = await this.appointmentService.checkSlot(data)
			if (!checkSlot) {
				await this.appointmentService.createSlot(data)
				return await this.appointmentService.create(data)
			} else if (checkSlot) {
				if (!checkSlot.avaliable) {
					return new UnauthorizedException('Appointment slot not avaliable!')
				}
				await this.appointmentService.editSlot(checkSlot.id, {
					avaliable: false,
					date: data.date,
					time: data.time,
					UserId: data.UserId,
				})
				return await this.appointmentService.create(data)
			}
		} catch (error) {
			return error
		}
	}

	@Delete('/:id')
	async delete(@Param() { id }: { id: string }) {
		try {
			const appointmentToDelete = await this.appointmentService.getById(id)
			if (!appointmentToDelete) {
				throw new NotFoundException('Appointment not found')
			}

			const checkSlot =
				await this.appointmentService.checkSlot(appointmentToDelete)
			if (!checkSlot) {
				throw new NotFoundException('Appointment Slot not found')
			}

			await this.appointmentService.editSlot(checkSlot.id, {
				avaliable: true,
				date: appointmentToDelete.date,
				time: appointmentToDelete.time,
				UserId: appointmentToDelete.UserId,
			})

			await this.appointmentService.delete(appointmentToDelete.id)

			return { msg: 'Appointment deleted ', slot: checkSlot }
		} catch (error) {
			return error
		}
	}
}
