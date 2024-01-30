import {
	Body,
	Controller,
	Delete,
	Get,
	UnauthorizedException,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyDTO } from './dto/company.dto'
import { UpdateCompanyDTO } from './dto/update-company.dto'

@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

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
	async getOne(@Param() { id }: { id: string }) {
		try {
			await this.checkCompanyExist(id)
			return await this.companyService.getById(id)
		} catch (error) {
			return error
		}
	}
	@Post()
	async create(@Body() data: CompanyDTO) {
		try {
			return await this.companyService.create(data)
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
