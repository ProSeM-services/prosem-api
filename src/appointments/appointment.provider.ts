import {
	APPOINTMENT_REPOSITORY,
	APPOINTMENTSLOTS_REPOSITORY,
} from 'src/core/constants'
import { Appointment } from './schema/appointment.model'
import { AppoinmentSlots } from './schema/appointmentSlots.model'

export const appointmentProvider = [
	{
		provide: APPOINTMENT_REPOSITORY,
		useValue: Appointment,
	},
	{
		provide: APPOINTMENTSLOTS_REPOSITORY,
		useValue: AppoinmentSlots,
	},
]
