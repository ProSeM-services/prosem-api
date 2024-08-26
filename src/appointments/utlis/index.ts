import { IWorkhour } from 'src/core/types/workhours'
import { AppointmentDTO } from '../dto/appointment.dto'
import { UnauthorizedException } from '@nestjs/common'
import { Appointment } from '../schema/appointment.model'

const formatTime = (totalMinutes: number): string => {
	const hours = Math.floor(totalMinutes / 60)
		.toString()
		.padStart(2, '0')
	const minutes = (totalMinutes % 60).toString().padStart(2, '0')
	return `${hours}:${minutes}`
}
// Función para obtener las opciones de horarios disponibles según el día seleccionado

const isTimeSlotAvailable = (startTime, duration, appointments) => {
	const [startHours, startMinutes] = startTime.split(':')
	const startTotalMinutes = parseInt(startHours) * 60 + parseInt(startMinutes)
	const endTotalMinutes = startTotalMinutes + duration

	return appointments.every((app) => {
		if (app.canceled) return true

		const [appHours, appMinutes] = app.time.split(':')
		const appStartTotalMinutes = parseInt(appHours) * 60 + parseInt(appMinutes)
		const appEndTotalMinutes = appStartTotalMinutes + app.duration

		// Check if the appointment conflicts with the current time slot
		return (
			endTotalMinutes <= appStartTotalMinutes ||
			startTotalMinutes >= appEndTotalMinutes
		)
	})
}
export const getAvailableTimes = (
	workhours: IWorkhour[],
	selectedDay: number,
	duration: number,
	appointments: Appointment[]
) => {
	const selectedWorkhours = workhours.find((wh) => wh.day === selectedDay)
	if (!selectedWorkhours) return []

	const availableTimes = []

	selectedWorkhours.segments.forEach(({ startime, endTime }) => {
		let currentTime = startime
		while (currentTime <= endTime) {
			const [hours, minutes] = currentTime.split(':')
			const totalMinutes = parseInt(hours) * 60 + parseInt(minutes)
			const endOfService = formatTime(totalMinutes + duration)

			// Verifica si el servicio cabe dentro del horario segmentado
			if (
				endOfService <= endTime &&
				isTimeSlotAvailable(currentTime, duration, appointments)
			) {
				availableTimes.push(currentTime)
			}

			currentTime = formatTime(totalMinutes + duration)
		}
	})

	return availableTimes
}

export async function validateAppointmentData(
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
			const hoursList = await this.getSlotsByDate(data.UserId, data.date, duration)
			if (hoursList.some((slot) => slot.hs === data.time)) {
				return true
			}
		}
	}

	throw new UnauthorizedException('This time is not avaialble.')
}
