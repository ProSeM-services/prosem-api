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
	Request,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { AppointmentsService } from './appointments.service'
import { AppointmentDTO } from './dto/appointment.dto'
import { UserService } from 'src/user/user.service'
import { ServicesService } from 'src/services/services.service'
import { IWorkhour } from 'src/core/types/workhours'
import { getAvailableTimes } from './utlis'
import { SlotAppointmentDTO } from './dto/slot.dto'
import { CustomerService } from 'src/customer/customer.service'
import { ICreateCustomer } from 'src/customer/schema/customer.zod'
import { AuthService } from 'src/auth/auth.service'

@Controller('appointments')
export class AppointmentsController {
	constructor(
		private readonly appointmentService: AppointmentsService,
		private readonly userService: UserService,
		private readonly servicesSerivce: ServicesService,
		private readonly customerService: CustomerService,
		private authService: AuthService
	) {}
	async getSlotsByDate(userId: string, date: string, duration: number) {
		const user = await this.userService.getById(userId)

		if (!user) {
			throw new UnauthorizedException('Member not found.')
		}
		const appointments = await this.appointmentService.getByUser(userId)
		const selectedDate = new Date(date).getDay()
		const availableTimes = getAvailableTimes(
			user.workhours,
			selectedDate,
			duration,
			appointments.filter((appointment) => appointment.date === date)
		)

		const isAvaialable = (hs: string) => {
			if (appointments.filter((app) => app.time === hs).length === 0) return true

			return !appointments
				.filter((app) => app.time === hs)
				.some((app) => !app.canceled)
		}
		const res = availableTimes.map((hs) => ({
			hs,
			available: isAvaialable(hs),
		}))

		return {
			availableTimes: res,
			user,
		}
	}
	async validateAppointmentData(
		data: AppointmentDTO,
		workhours: IWorkhour[],
		duration: number
	) {
		const selectedWorkhours = workhours.find(
			(wh) => wh.day === new Date(data.date).getDay()
		)
		if (!selectedWorkhours) {
			throw new UnauthorizedException('This day is not work day.')
		}
		for (const segment of selectedWorkhours.segments) {
			if (data.time >= segment.startime && data.time <= segment.endTime) {
				const { availableTimes } = await this.getSlotsByDate(
					data.UserId,
					data.date,
					duration
				)

				if (availableTimes.some((slot) => slot.hs === data.time)) {
					return true
				}
			}
		}

		throw new UnauthorizedException('This time is not avaialble.')
	}
	@Get()
	async getAll(@Request() req: ExpressRequest) {
		try {
			const token = await this.authService.getTenantFromHeaders(req)
			if (!token) {
				throw new UnauthorizedException('Missing or invalid token')
			}

			return await this.appointmentService.getAll(token)
		} catch (error) {
			return error
		}
	}

	@Get('/customer/:id')
	async getByCustomer(@Param('id') id: string) {
		try {
			return await this.appointmentService.getByCustomer(id)
		} catch (error) {
			return error
		}
	}

	@Post('member-slots')
	async memberSlots(
		@Body()
		{ UserId, date, duration }: SlotAppointmentDTO
	) {
		try {
			return await this.getSlotsByDate(UserId, date, duration)
		} catch (error) {
			return error
		}
	}
	@Post()
	async create(@Body() data: AppointmentDTO) {
		try {
			const user = await this.userService.getById(data.UserId)
			if (!user) {
				throw new UnauthorizedException('User not found.')
			}
			if (!user.CompanyId) {
				throw new UnauthorizedException('User no tiene company')
			}
			const service = await this.servicesSerivce.getById(data.ServiceId)
			if (!service) {
				throw new UnauthorizedException('Service not found.')
			}
			await this.validateAppointmentData(data, user.workhours, service.duration)

			//EN ESTE PUNTO LOS DATOS INGRESADOS PARA EL USUARIO, SERVICIO Y HORARIO, SON VALIDOS.

			// Ahora tenemos que validar que no haya un turno con esa misma data!
			const appointment = await this.appointmentService.findByAppointmentInfo({
				date: data.date,
				UserId: data.UserId,
				time: data.time,
			})
			if (appointment && !appointment.canceled) {
				throw new UnauthorizedException('This appointment slot is not available.')
			}

			const customerData: ICreateCustomer = {
				email: data.email,
				firstName: data.name,
				lastName: data.lastName,
				phone: data.phone,
				tenantName: user.tenantName,
			}
			const customer = await this.customerService.findOrCreateByEmail(customerData)

			//EN ESTE PUNTO: Los datos estan OK y se puede sacar el turno.
			const newAppointment = await this.appointmentService.create({
				...data,
				duration: service.duration,
				canceled: false,
				CustomerId: customer.id,
				tenantName: user.tenantName,
				companyId: user.CompanyId,
			})

			//TODO: Luego de crear el turno hay que hacer la logica de customer, usando el email cómo valor unico.

			return newAppointment
		} catch (error) {
			return error
		}
	}
	@Post('cancel')
	async cancelAppointment(
		@Body()
		{ appointmemntId }: { appointmemntId: string }
	) {
		try {
			const appointment = await this.appointmentService.getById(appointmemntId)
			if (!appointment) {
				throw new UnauthorizedException('Appointment not found.')
			}

			const user = await this.userService.getById(appointment.UserId)
			if (!user) {
				throw new UnauthorizedException('User not found.')
			}

			await this.appointmentService.cancelAppointment(appointment)

			return 'Appointment cancelled succesfully!'
		} catch (error) {
			return error
		}
	}
}
