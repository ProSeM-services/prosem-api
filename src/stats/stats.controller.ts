import { Controller, Get, Query, Request } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { Request as ExpressRequest } from 'express'
import { CustomerService } from 'src/customer/customer.service'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { ServicesService } from 'src/services/services.service'
@Controller('stats')
export class StatsController {
	constructor(
		private readonly companyService: CompanyService,
		private readonly userServices: UserService,
		private readonly appointmentService: AppointmentsService,
		private readonly customerService: CustomerService,
		private readonly authService: AuthService,
		private readonly serviceService: ServicesService
	) {}

	@Get('/customers-by-month')
	async getCustomersByMonths(
		@Request() req: ExpressRequest,
		@Query() query: { start: string; end: string; year: string }
	) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			const customers = await this.customerService.getAll(tenantName)

			const { start, end, year } = query
			const startDate = new Date(`${year}-${start}-01`)
			const endDate = new Date(`${year}-${end}-31`)

			const filteredCustomers = customers.filter((customer) => {
				const createdAt = new Date(customer.createdAt)
				return createdAt >= startDate && createdAt <= endDate
			})

			const monthlyData: { month: string; count: number; fill: string }[] = []
			const months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			]

			// Initialize counts for each month in range
			for (let i = parseInt(start) - 1; i <= parseInt(end) - 1; i++) {
				monthlyData.push({
					month: months[i],
					count: 0,
					fill: `var(--color-${months[i].toLowerCase()})`,
				})
			}

			// Count customers per month
			filteredCustomers.forEach((customer) => {
				const customerMonth = new Date(customer.createdAt).getMonth()
				const monthIndex = monthlyData.findIndex(
					(data) => data.month === months[customerMonth]
				)
				if (monthIndex !== -1) {
					monthlyData[monthIndex].count++
				}
			})

			return monthlyData
		} catch (error) {
			throw error
		}
	}

	@Get('/appointmets-by-month')
	async getAppintmentsByMonths(
		@Request() req: ExpressRequest,
		@Query()
		query: { start: string; end: string; year: string; serivceId: string }
	) {
		try {
			const { EnterpriseId } = await this.authService.getDataFromToken(req)
			const { appointments } = await this.appointmentService.getAll(EnterpriseId)
			const services = await this.serviceService.getAll()
			const { start, end, year } = query
			const startDate = new Date(`${year}-${parseInt(start) + 1}-01`)
			const endDate = new Date(`${year}-${parseInt(end) + 1}-31`)

			const fleterdAppointments = appointments.filter((appointment) => {
				const date = new Date(appointment.date)
				return date >= startDate && date <= endDate
			})

			const scheduledServices = [
				...new Set(fleterdAppointments.map((e) => e.ServiceId)),
			].map((e) => services.filter((s) => s.id === e)[0].title)
			const fleterdAppointmentsSummary = fleterdAppointments.map((e) => ({
				date: e.date,
				service: services.filter((s) => s.id === e.ServiceId)[0].title,
			}))
			const monthlyData = []
			const months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			]

			// Initialize counts for each month in range
			for (let i = parseInt(start); i <= parseInt(end); i++) {
				const servicesCounts = {}
				scheduledServices.forEach((e) => {
					servicesCounts[e] = 0
				})
				monthlyData.push({
					month: months[i],
					...servicesCounts,
					// fill: `var(--color-${months[i].toLowerCase()})`,
				})
			}

			// Count customers per month
			fleterdAppointmentsSummary.forEach((appointment) => {
				const appointmnetMonth = new Date(appointment.date).getMonth()
				const service = appointment.service
				const monthIndex = monthlyData.findIndex(
					(data) => data.month === months[appointmnetMonth]
				)
				if (monthIndex !== -1) {
					monthlyData[monthIndex][service]++
				}
			})

			return monthlyData
		} catch (error) {
			throw error
		}
	}
}
