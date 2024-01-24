import {
	Controller,
	Get,
	Param,
	NotFoundException,
	Body,
	Post,
	Delete,
	Patch,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CompanyService } from 'src/company/company.service'
import { UpdateUserDTO, UserDTO } from './dto/user.dto'
import * as bcrypt from 'bcrypt'
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly comapanyService: CompanyService
	) {}

	async checkUserExist(id: number) {
		const userToCheck = await this.userService.getById(id)
		if (!userToCheck) {
			throw new NotFoundException('User not found!')
		}
	}
	async isTenantIdOk(tenantId: string) {
		const coompany = await this.comapanyService.getByTenant(tenantId)
		if (!coompany) {
			throw new NotFoundException('coompany not found!')
		}
	}
	@Get()
	async getAll() {
		try {
			return this.userService.getAll()
		} catch (error) {
			return error
		}
	}
	@Get('/:id')
	async getOne(@Param() { id }: { id: number }) {
		console.log({ id })
		try {
			await this.checkUserExist(id)
			return this.userService.getById(id)
		} catch (error) {
			return error
		}
	}

	@Get('/tenant/:tenant')
	async getByTenant(@Param() { tenant }: { tenant: string }) {
		try {
			return this.userService.getByTenant(tenant)
		} catch (error) {
			return error
		}
	}

	@Delete('/:id')
	async delete(@Param() { id }: { id: number }) {
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
			await this.isTenantIdOk(user.tenantId)

			const hashPassword = await bcrypt.hash(user.password, +process.env.HASH_SALT)
			return await this.userService.create({ ...user, password: hashPassword })
		} catch (error) {
			return error
		}
	}
	@Patch('/:id')
	async updateUser(
		@Body() user: UpdateUserDTO,
		@Param() { id }: { id: number }
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
