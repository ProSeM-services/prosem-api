import {
	Controller,
	Get,
	Param,
	NotFoundException,
	Body,
	Post,
	Delete,
	Patch,
	Headers,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CompanyService } from 'src/company/company.service'
import { UpdateUserDTO, UserDTO } from './dto/user.dto'
import * as bcrypt from 'bcrypt'
import { WorkhoursService } from 'src/workhours/workhours.service'
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly comapanyService: CompanyService,
		private readonly workhoursService: WorkhoursService
	) {}

	async checkUserExist(id: string) {
		try {
			await this.userService.getById(id)
		} catch (error) {
			throw new NotFoundException('User not found!')
		}
	}
	async isCompanyOk(companyId: string) {
		try {
			const company = await this.comapanyService.getById(companyId)
			if (!company) throw new NotFoundException('Company not found!')
		} catch (error) {
			throw error
		}
	}
	@Get()
	async getAll(@Headers('CompanyId') companyId: string) {
		try {
			return this.userService.getAll(companyId)
		} catch (error) {
			return error
		}
	}

	@Get('/employees')
	async getAllEmployees(@Headers('CompanyId') companyId: string) {
		try {
			return this.userService.getEmployees(companyId)
		} catch (error) {
			return error
		}
	}
	@Get('/:id')
	async getOne(@Param() { id }: { id: string }) {
		try {
			await this.checkUserExist(id)
			return this.userService.getById(id)
		} catch (error) {
			return error
		}
	}

	@Get('/company/:companyId')
	async getByTenant(@Param() { companyId }: { companyId: string }) {
		try {
			return this.userService.getByCompany(companyId)
		} catch (error) {
			return error
		}
	}

	@Delete('/:id')
	async delete(@Param() { id }: { id: string }) {
		try {
			await this.checkUserExist(id)
			const deleteStatus = await this.userService.delete(id)
			if (deleteStatus === 1)
				return { message: 'user has been deleted succesfully' }
		} catch (error) {
			return error
		}
	}
	@Post()
	async createUser(@Body() user: UserDTO) {
		try {
			await this.isCompanyOk(user.CompanyId)

			const hashPassword = await bcrypt.hash(user.password, +process.env.HASH_SALT)
			return await this.userService.create({ ...user, password: hashPassword })
		} catch (error) {
			return error
		}
	}
	@Patch('/:id')
	async updateUser(
		@Body() user: UpdateUserDTO,
		@Param() { id }: { id: string }
	) {
		try {
			await this.checkUserExist(id)
			if (user.password) {
				const hashPassword = await bcrypt.hash(
					user.password,
					+process.env.HASH_SALT
				)
				return await this.userService.update(id, {
					...user,
					password: hashPassword,
				})
			}
			return await this.userService.update(id, user)
		} catch (error) {
			return error
		}
	}
}
