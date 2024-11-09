import { Controller, Get, Query, Request } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { Request as ExpressRequest } from 'express'
import { CustomerService } from 'src/customer/customer.service'
@Controller('stats')
export class StatsController {
	constructor(
		private readonly companyService: CompanyService,
		private readonly userServices: UserService,
		private readonly customerService: CustomerService,
		private readonly authService: AuthService
	) {}

	@Get('/customers-by-month')
	async getCustomersByMonth(
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
}
