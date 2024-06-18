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
} from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyDTO, UpdateCompanyDTO } from './dto/company.dto'

import { Company } from './schema/company.model'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/schema/user.model'
import { UserDTO } from 'src/user/dto/user.dto'
import { AuthService } from 'src/auth/auth.service'

@Controller('company')
export class CompanyController {
	constructor(
		private readonly companyService: CompanyService,
		private readonly userServices: UserService,
		private readonly authService: AuthService
	) {}

	async checkCompanyExist(id: string) {
		const companyToUpdate = await this.companyService.getById(id)
		if (!companyToUpdate) {
			throw new UnauthorizedException('Company not found!')
		}
	}

	@Get()
	async getAll() {
		try {
			return await this.companyService.getAll()
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
	async create(@Body() data: CompanyDTO) {
		try {
			const newCompany = await this.companyService.create(data)

			const userName = `${newCompany.name
				.split('')
				.filter((e) => e !== ' ')
				.join('')
				.toLowerCase()}.admin`
			const adminUser: UserDTO = {
				CompanyId: newCompany.id,
				email: newCompany.email,
				image: '',
				lastName: 'Admin',
				name: newCompany.name,
				password: `${userName}123`,
				phone: '',
				role: 'admin',
				userName,
			}

			const admin = await this.authService.register(adminUser)
			return {
				newCompany,
				admin,
			}
		} catch (error) {
			return error
		}
	}
	@Delete(':id')
	async delete(@Param() { id }: { id: string }) {
		try {
			this.checkCompanyExist(id)
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
