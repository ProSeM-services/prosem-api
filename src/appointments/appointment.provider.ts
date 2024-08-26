import { APPOINTMENT_REPOSITORY } from 'src/core/constants'
import { Appointment } from './schema/appointment.model'

export const appointmentProvider = [
	{
		provide: APPOINTMENT_REPOSITORY,
		useValue: Appointment,
	},
]
