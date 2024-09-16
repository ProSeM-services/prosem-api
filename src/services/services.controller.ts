import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	Query,
	Request,
	UnauthorizedException,
	Patch,
} from '@nestjs/common'
import { ServicesService } from './services.service'
import { Service } from './schema/service.model'
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
import { CompanyService } from 'src/company/company.service'
import {
	CreateServicesDto,
	UpdateServicesDto,
	AddToCompanyServicesDto,
} from './dto/services.dto'

@Controller('services')
export class ServicesController {
	constructor(
		private readonly servicesService: ServicesService,
		private readonly companyService: CompanyService,
		private readonly authService: AuthService
	) {}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		const tenantName = await this.authService.getTenantFromHeaders(req)
		return this.servicesService.getAll()
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.servicesService.getById(id)
	}

	@Get('search/title')
	async getByTitle(@Query('title') title: string) {
		return this.servicesService.getByTitle(title)
	}

	@Post()
	async create(@Body() data: CreateServicesDto, @Request() req: ExpressRequest) {
		const tenantName = await this.authService.getTenantFromHeaders(req)

		const existTitle = await this.servicesService.getByTitle(data.title)

		if (existTitle) {
			throw new UnauthorizedException('This title already exist in your services!')
		}
		return this.servicesService.create({ ...data, tenantName })
	}

	@Post('/add-to-company')
	async addToCompany(@Body() addToCompanyDto: AddToCompanyServicesDto) {
		try {
			const { companyId, serviceId } = addToCompanyDto
			const service = await this.servicesService.getById(serviceId)
			if (!service) {
				throw new UnauthorizedException('Service not found')
			}

			const company = await this.companyService.getById(companyId)
			if (!company) {
				throw new UnauthorizedException('Company not found')
			}

			return await this.servicesService.addToCompany(companyId, serviceId)
		} catch (error) {
			return error
		}
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() data: UpdateServicesDto) {
		return this.servicesService.update(id, data)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.servicesService.delete(id)
	}
}
