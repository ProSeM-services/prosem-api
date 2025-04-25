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
	BadRequestException,
	Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CompanyService } from 'src/company/company.service'
import { UpdateUserDTO, UserDTO } from './dto/user.dto'
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
import { Permission } from 'src/core/types/permissions'
import { MailerService } from 'src/mailer/mailer.service'
import { User } from './schema/user.model'
import { v4 as uuidv4 } from 'uuid'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly comapanyService: CompanyService,
		private readonly enterpriseService: EnterpriseService,
		private authService: AuthService,
		private mailerService: MailerService
	) {}

	async checkUserExist(id: string) {
		try {
			const user = await this.userService.getById(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}

			return user
		} catch (error) {
			throw error
		}
	}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		try {
			const { EnterpriseId } = await this.authService.getDataFromToken(req)
			if (!EnterpriseId) {
				throw new UnauthorizedException('Missing or invalid token')
			}

			return this.userService.getAll(EnterpriseId)
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
			throw error
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
			throw error
		}
	}
	@Get('/free')
	async getFree(@Request() req: ExpressRequest) {
		try {
			const { EnterpriseId } = await this.authService.getDataFromToken(req)
			if (!EnterpriseId) {
				throw new UnauthorizedException('Missing or invalid token')
			}
			return this.userService.getFree(EnterpriseId)
		} catch (error) {
			throw error
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
			throw error
		}
	}
	@Post()
	async createUser(@Request() req: ExpressRequest, @Body() user: UserDTO) {
		try {
			const { tenantName, EnterpriseId } =
				await this.authService.getDataFromToken(req)

			const checkUserName = await this.userService.getByUserName(
				user.userName,
				tenantName
			)

			if (checkUserName) {
				throw new UnauthorizedException(
					`UserName ${checkUserName.userName} already exist in this account. `
				)
			}
			const token = uuidv4()
			const expiration = new Date()
			expiration.setHours(expiration.getHours() + 24)
			const hashPassword = await bcrypt.hash(user.password, +process.env.HASH_SALT)
			const data: UserDTO = {
				...user,
				password: hashPassword,
				tenantName,
				emailConfirmed: false,
				confirmationToken: token,
				confirmationTokenExpiresAt: expiration,
				account_type: 'PROFESSIONAL',
			}
			const newUser = await this.userService.create({ ...data, EnterpriseId })
			await this.mailerService.sendEmail(user.email, {
				name: `${user.name} ${user.lastName}`,
				token,
			})
			return newUser
		} catch (error) {
			throw error
		}
	}
	@Post('/add-to-company')
	async addToCompany(
		@Body() { companyId, userId }: { companyId: string; userId: string }
	) {
		try {
			const updatedUser: Partial<User> = {}
			const user = await this.userService.getById(userId)
			if (!user) {
				throw new UnauthorizedException('User not found')
			}

			const company = await this.comapanyService.getById(companyId)
			if (!company) {
				throw new UnauthorizedException('Company not found')
			}

			if (!user.workhours.length) {
				updatedUser.workhours = company.workhours
			}
			updatedUser.CompanyId = companyId

			await this.userService.update(userId, updatedUser)

			return `User added to company ${company.name} successfully!`
		} catch (error) {
			throw error
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
			throw error
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
			if (data.permissions) {
				const invalidPermissions = data.permissions.filter(
					(perm) => !Object.values(Permission).includes(perm)
				)
				if (invalidPermissions.length > 0) {
					throw new BadRequestException(
						`Permisos inválidos: ${invalidPermissions.join(', ')}`
					)
				}
			}

			await user.update(data)

			// Guardar el modelo actualizado
			await user.save()
			return user
		} catch (error) {
			throw error
		}
	}

	@Post('/invite/:id')
	async inviteUser(
		@Param() { id }: { id: string },
		@Request() req: ExpressRequest
	) {
		try {
			const { EnterpriseId } = await this.authService.getDataFromToken(req)
			const user = await this.checkUserExist(id)
			if (!user) {
				throw new NotFoundException('User not found!')
			}

			const enterprise = await this.enterpriseService.findOne(EnterpriseId)
			const { email, name } = user

			await this.mailerService.sendInvite(email, {
				companyName: enterprise.name,
				name,
				token: '',
			})
		} catch (error) {
			throw error
		}
	}
	@Get('/search')
	async searchMembers(@Query('value') value: string) {
		try {
			if (!value) {
				return [] // Retornar vacío si no hay valor
			}
			return this.userService.searchUsers(value)
		} catch (error) {
			throw error
		}
	}
}
