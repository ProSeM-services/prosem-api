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
@Controller('company')
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
	}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			return await this.companyService.getAll(tenantName)
		} catch (error) {
			return error
		}
	}
	@Get(':id')
	async getOne(@Param() { id }: { id: Company['id'] }) {
		try {
			await this.checkCompanyExist(id)
			return await this.companyService.getById(id)
		} catch (error) {
			return error
		}
	}
	@Get('/name/:name')
	async getByName(@Param() { name }: { name: Company['name'] }) {
		try {
			const company = await this.companyService.getByName(name)
			if (!company.length) throw new NotFoundException('Company not found!')

			return company
		} catch (error) {
			return error
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
			})
		} catch (error) {
			return error
		}
	}
	@Delete(':id')
	async delete(@Param() { id }: { id: string }) {
		try {
			await this.checkCompanyExist(id)
			const deleteStatus = await this.companyService.delete(id)
			if (deleteStatus !== 1) {
				return 'error at deleting company'
			}
			return 'company has been deleted, succesfully!'
		} catch (error) {
			console.log(error)
			return error
		}
	}
	@Patch(':id')
	async update(@Param() { id }: { id: string }, @Body() data: UpdateCompanyDTO) {
		try {
			await this.checkCompanyExist(id)
			await this.companyService.update(id, data)
			return 'company has been updated, succesfully!'
		} catch (error) {
			return error
		}
	}
}
