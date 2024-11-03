import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Request,
} from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CreateCustomerDTO } from './dto/customer.dto'
import { Request as ExpressRequest } from 'express'
import { AuthService } from 'src/auth/auth.service'
@Controller('customer')
export class CustomerController {
	constructor(
		private readonly customerService: CustomerService,
		private authService: AuthService
	) {}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		const token = await this.authService.getTenantFromHeaders(req)
		try {
			return this.customerService.getAll(token)
		} catch (error) {
			return error
		}
	}
	@Get('/:id')
	async getById(@Param() params: { id: string }) {
		try {
			return this.customerService.getById(params.id)
		} catch (error) {
			return error
		}
	}
	@Post()
	async create(@Body() data: CreateCustomerDTO) {
		try {
			const customer = await this.customerService.getByEmail(data.email)
			if (!customer) {
				return this.customerService.create(data)
			}

			return customer
		} catch (error) {
			return error
		}
	}
	@Delete('/:id')
	async delete(@Param() params: { id: string }) {
		try {
			return this.customerService.delete(params.id)
		} catch (error) {
			return error
		}
	}
}
