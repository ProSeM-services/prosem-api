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
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
import { CompanyService } from 'src/company/company.service'
import {
	CreateServicesDto,
	UpdateServicesDto,
	AddToCompanyServicesDto,
	AddUserToServiceDTO,
} from './dto/services.dto'
import { UserService } from 'src/user/user.service'

@Controller('services')
export class ServicesController {
	constructor(
		private readonly servicesService: ServicesService,
		private readonly userService: UserService,
		private readonly companyService: CompanyService,
		private readonly authService: AuthService
	) {}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			return this.servicesService.getAll(tenantName)
		} catch (error) {
			throw error
		}
	}

	@Get('/clients')
	async getAllFromCLients(@Request() req: ExpressRequest) {
		try {
			return this.servicesService.getAll()
		} catch (error) {
			throw error
		}
	}

	@Get('/clients/:id')
	async getByIdFromCLients(@Param('id') id: string) {
		try {
			if (!id) throw new Error('id require ')
			return this.servicesService.getById(id)
		} catch (error) {
			throw error
		}
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		try {
			if (!id) throw new Error('id require ')
			return this.servicesService.getById(id)
		} catch (error) {
			throw error
		}
	}

	@Get('search/title')
	async getByTitle(@Query('title') title: string) {
		try {
			return this.servicesService.getByTitle(title)
		} catch (error) {
			throw error
		}
	}

	@Post()
	async create(@Body() data: CreateServicesDto, @Request() req: ExpressRequest) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			const existTitle = await this.servicesService.getByTitle(data.title)

			if (existTitle) {
				throw new UnauthorizedException(
					'This title already exist in your services!'
				)
			}
			return this.servicesService.create({ ...data, tenantName })
		} catch (error) {
			throw error
		}
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
			throw error
		}
	}

	@Post('/add-member')
	async addMember(@Body() addMemberDto: AddUserToServiceDTO) {
		try {
			const { serviceId, userId } = addMemberDto
			const service = await this.servicesService.getById(serviceId)
			if (!service) {
				throw new UnauthorizedException('Service not found')
			}

			const member = await this.userService.getById(userId)
			if (!member) {
				throw new UnauthorizedException('Member not found')
			}

			return await this.servicesService.addMember(serviceId, userId)
		} catch (error) {
			throw error
		}
	}

	@Post('/remove-member')
	async removeMember(@Body() addToCompanyDto: AddUserToServiceDTO) {
		try {
			const { userId, serviceId } = addToCompanyDto
			const service = await this.servicesService.getById(serviceId)
			if (!service) {
				throw new UnauthorizedException('Service not found')
			}

			const member = await this.userService.getById(userId)
			if (!member) {
				throw new UnauthorizedException('Member not found')
			}

			return await this.servicesService.removeMember(serviceId, userId)
		} catch (error) {
			throw error
		}
	}

	@Post('/remove-from-company')
	async removeFromCompany(@Body() addToCompanyDto: AddToCompanyServicesDto) {
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

			return await this.servicesService.removeFromCompany(companyId, serviceId)
		} catch (error) {
			throw error
		}
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() data: UpdateServicesDto) {
		try {
			return this.servicesService.update(id, data)
		} catch (error) {
			throw error
		}
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		try {
			return this.servicesService.delete(id)
		} catch (error) {
			throw error
		}
	}
}
