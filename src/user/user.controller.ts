import {
	Controller,
	Get,
	Param,
	NotFoundException,
	Body,
	Post,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CompanyService } from 'src/company/company.service'
import { UserDTO } from './dto/user.dto'
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
	@Get(':id')
	async getOne(@Param() { id }: { id: number }) {
		try {
			await this.checkUserExist(id)
			return this.userService.getById(id)
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
}
