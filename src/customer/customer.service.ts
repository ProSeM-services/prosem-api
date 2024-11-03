import { Inject, Injectable } from '@nestjs/common'
import { CreateCustomerDTO } from './dto/customer.dto'
import { CUSTOMERS_REPOSITORY } from 'src/core/constants'
import { Customer } from './schema/customer.model'
import { Appointment } from 'src/appointments/schema/appointment.model'

@Injectable()
export class CustomerService {
	constructor(
		@Inject(CUSTOMERS_REPOSITORY) private readonly customerModel: typeof Customer
	) {}

	async getAll(token: string): Promise<Customer[]> {
		return this.customerModel.findAll({
			where: {
				tenantName: token,
			},
			include: [Appointment],
		})
	}
	async getById(id: string): Promise<Customer> {
		return this.customerModel.findOne({
			where: { id },
		})
	}
	async getByEmail(email: string): Promise<Customer> {
		return this.customerModel.findOne({
			where: { email },
		})
	}
	async findOrCreateByEmail(data: CreateCustomerDTO): Promise<Customer> {
		const customer = await this.customerModel.findOne({
			where: { email: data.email },
		})

		if (customer) return customer

		return await this.customerModel.create(data)
	}
	async create(data: CreateCustomerDTO) {
		return await this.customerModel.create(data)
	}
	async delete(id: string) {
		return await this.customerModel.destroy({ where: { id } })
	}
}
