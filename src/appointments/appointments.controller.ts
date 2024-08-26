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
}
