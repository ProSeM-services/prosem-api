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
	UnauthorizedException,
	Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CompanyService } from 'src/company/company.service'
import { UpdateUserDTO, UserDTO } from './dto/user.dto'
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly comapanyService: CompanyService,
		private authService: AuthService
	) {}

	async checkUserExist(id: string) {
		try {
			const user = await this.userService.getById(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}

			return user
		} catch (error) {
			return error
		}
	}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		try {
			const token = await this.authService.getTenantFromHeaders(req)
			if (!token) {
				throw new UnauthorizedException('Missing or invalid token')
			}

			return this.userService.getAll(token)
		} catch (error) {
			throw error
		}
	}

	@Get('/clients/:id')
	async getForClient(@Param() { id }: { id: string }) {
		try {
			const user = await this.checkUserExist(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}
			return user
		} catch (error) {
			return error
		}
	}
	@Get('/details/:id')
	async getOne(@Param() { id }: { id: string }) {
		try {
			const user = await this.checkUserExist(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}
			return user
		} catch (error) {
			return error
		}
	}
	@Get('/free')
	async getFree(@Request() req: ExpressRequest) {
		try {
			const token = await this.authService.getTenantFromHeaders(req)
			if (!token) {
				throw new UnauthorizedException('Missing or invalid token')
			}
			return this.userService.getFree(token)
		} catch (error) {
			return error
		}
	}

	@Delete('/:id')
	async delete(@Param() { id }: { id: string }) {
		try {
			const user = await this.checkUserExist(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}
			const deleteStatus = await this.userService.delete(id)
			if (deleteStatus === 1)
				return { message: 'user has been deleted succesfully' }
		} catch (error) {
			return error
		}
	}
	@Post()
	async createUser(@Request() req: ExpressRequest, @Body() user: UserDTO) {
		try {
			const tenantName = await this.authService.getTenantFromHeaders(req)
			const hashPassword = await bcrypt.hash(user.password, +process.env.HASH_SALT)
			const data: UserDTO = {
				...user,
				password: hashPassword,
				tenantName,
			}

			return await this.userService.create(data)
		} catch (error) {
			return error
		}
	}
	@Post('/add-to-company')
	async addToCompany(
		@Body() { companyId, userId }: { companyId: string; userId: string }
	) {
		try {
			const user = await this.userService.getById(userId)
			if (!user) {
				throw new UnauthorizedException('User not found')
			}

			const company = await this.comapanyService.getById(companyId)
			if (!company) {
				throw new UnauthorizedException('Company not found')
			}

			await this.userService.addToCompany(userId, companyId)

			return `User added to company ${company.name} successfully!`
		} catch (error) {
			return error
		}
	}
	@Post('/remove-from-company')
	async removeFromCompany(@Body() { userId }: { userId: string }) {
		try {
			const user = await this.userService.getById(userId)
			if (!user) {
				throw new UnauthorizedException('User not found')
			}

			await this.userService.removeFromCompany(userId)
			return `User removed from company successfully!`
		} catch (error) {
			return error
		}
	}
	@Patch('/:id')
	async updateUser(
		@Body() data: UpdateUserDTO,
		@Param() { id }: { id: string }
	) {
		try {
			const user = await this.checkUserExist(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}
			if (data.password) {
				const hashPassword = await bcrypt.hash(
					data.password,
					+process.env.HASH_SALT
				)
				return await this.userService.update(id, {
					...data,
					password: hashPassword,
				})
			}
			return await this.userService.update(id, data)
		} catch (error) {
			return error
		}
	}
}
