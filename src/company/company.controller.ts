import {
	Body,
	Controller,
	Delete,
	Get,
	UnauthorizedException,
	Param,
	Patch,
	Post,
	NotFoundException,
	Request,
	Query,
	UseGuards,
} from '@nestjs/common'
import { CompanyService } from './company.service'
import {
	CompanyDTO,
	CreateCompanyDTO,
	UpdateCompanyDTO,
} from './dto/company.dto'
import { Company } from './schema/company.model'
import { UserService } from 'src/user/user.service'
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
import { GeocodeService } from 'src/geocode/geocode.services'
import { Location } from './interfaces/location.interface'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PublicAcces } from 'src/auth/decorators/public.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorators'
@Controller('company')
@UseGuards(AuthGuard, RolesGuard)
export class CompanyController {
	constructor(
		private readonly companyService: CompanyService,
		private readonly userServices: UserService,
		private readonly geocodeService: GeocodeService,
		private readonly authService: AuthService
	) {}

	async checkCompanyExist(id: string) {
		const companyToUpdate = await this.companyService.getById(id)
		if (!companyToUpdate) {
			throw new UnauthorizedException('Company not found!')
		}
		return companyToUpdate
	}
	@PublicAcces()
	@Get('/clients')
	async getCompaniesForClients(
		@Query() query: { name: string; category: string; city: string }
	) {
		try {
			const { name, category, city } = query
			const res = await this.companyService.getCompanies({
				name: name || '',
				category: category || '',
				city: city ? city.split(',')[0] : '',
			})

			return !res || res.length === 0 ? [] : res
		} catch (error) {
			console.error('Controller: Error in getCompaniesForClients:', error)
			throw error
		}
	}
	@PublicAcces()
	@Get('/clients/company-detail/:id')
	async getCompanyDetailForClients(@Param() { id }: { id: Company['id'] }) {
		try {
			await this.checkCompanyExist(id)
			return await this.companyService.getById(id)
		} catch (error) {
			throw error
		}
	}
	@PublicAcces()
	@Get('/clients/company-detail/:id/services')
	async getServicesFromCompanyForClients(
		@Param() { id }: { id: Company['id'] }
	) {
		try {
			await this.checkCompanyExist(id)
			const data = await this.companyService.getById(id)
			//@ts-ignore
			return data.Services
		} catch (error) {
			throw error
		}
	}

	@Roles('ADMIN')
	@Get()
	async getAll(
		@Request() req: ExpressRequest,
		@Query() query: { name: string; category: string; city: string }
	) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			return await this.companyService.getAll(tenantName)
		} catch (error) {
			throw error
		}
	}
	@Get(':id')
	async getOne(@Param() { id }: { id: Company['id'] }) {
		try {
			await this.checkCompanyExist(id)
			return await this.companyService.getById(id)
		} catch (error) {
			throw error
		}
	}
	@Get('/name/:name')
	async getByName(@Param() { name }: { name: Company['name'] }) {
		try {
			const company = await this.companyService.getByName(name)
			if (!company.length) throw new NotFoundException('Company not found!')

			return company
		} catch (error) {
			throw error
		}
	}

	@Post()
	async create(@Request() req: ExpressRequest, @Body() data: CreateCompanyDTO) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			const { address } = data
			const locationData = await this.geocodeService.geocodeAddress(address)
			const formatedAddress: Location = {
				lat: locationData.lat,
				lng: locationData.lng,
				value: address,
				city: locationData.city,
			}
			return await this.companyService.create({
				...data,
				address: formatedAddress,
				tenantName,
				city: locationData.city,
			})
		} catch (error) {
			throw error
		}
	}
	@Delete(':id')
	async delete(@Param() { id }: { id: string }) {
		try {
			await this.checkCompanyExist(id)
			const usersFromCompany = await this.userServices.getByCompany(id)
			if (usersFromCompany.length > 0) {
				throw new UnauthorizedException(
					'Please delete the members form the company'
				)
			}
			const deleteStatus = await this.companyService.delete(id)
			if (deleteStatus !== 1) {
				throw new UnauthorizedException('error at deleting company')
			}
			return 'company has been deleted, succesfully!'
		} catch (error) {
			// Re-throw the error to maintain proper status code
			throw error
		}
	}
	@Patch(':id')
	async update(@Param() { id }: { id: string }, @Body() data: UpdateCompanyDTO) {
		try {
			await this.checkCompanyExist(id)
			await this.companyService.update(id, data)
			return 'company has been updated, succesfully!'
		} catch (error) {
			throw error
		}
	}
}
