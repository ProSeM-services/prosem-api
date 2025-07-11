import {
	Body,
	Controller,
	Patch,
	Post,
	Request,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { RegisterUserDTO, UserDTO } from 'src/user/dto/user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { MailerService } from 'src/mailer/mailer.service'
import { Request as ExpressRequest } from 'express'
import * as bcrypt from 'bcrypt'
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly mailerSerivce: MailerService
	) {}

	@Post('login')
	async login(@Body() { user, password }: LoginAuthDto) {
		const userValidate = await this.authService.validateUser(user, password)

		if (!userValidate) {
			throw new UnauthorizedException('Data not valid')
		}
		if (!userValidate.emailConfirmed) {
			throw new UnauthorizedException('Email no confirmado')
		}

		const jwt = await this.authService.generateJWT(userValidate)

		return {
			user: jwt.user,
			backendTokens: {
				accessToken: jwt.accessToken,
			},
		}
	}
	@Post('register')
	async register(@Body() user: RegisterUserDTO) {
		try {
			const validateEmail = await this.userService.findBy({
				key: 'email',
				value: user.email,
			})
			if (validateEmail) {
				throw new UnauthorizedException('El email ya se encuentra registrado.')
			}
			const validateUserName = await this.userService.findBy({
				key: 'userName',
				value: user.userName,
			})
			if (validateUserName) {
				throw new UnauthorizedException(
					'El nombre de usuario ya se encuentra registrado.'
				)
			}

			const token = uuidv4()
			const expiration = new Date()
			expiration.setHours(expiration.getHours() + 24)
			const data: UserDTO = {
				...user,
				emailConfirmed: false,
				confirmationToken: token,
				confirmationTokenExpiresAt: expiration,
			}
			const newUser = this.authService.register({ ...data })

			await this.mailerSerivce.sendEmail(user.email, {
				name: `${user.name} ${user.lastName}`,
				token,
			})
			return newUser
		} catch (error) {
			throw error
		}
	}
	@Patch('update-password')
	async validatePassword(
		@Body()
		{
			password,
			userId,
			newPassword,
		}: {
			password: string
			userId: string
			newPassword: string
		}
	) {
		try {
			const user = await this.userService.getById(userId)
			if (!user) {
				throw new UnauthorizedException(
					'El usuario no se encuentra registrado en base de datos.'
				)
			}
			const userValidate = await this.authService.validateUser(
				user.userName,
				password
			)
			if (!userValidate) {
				throw new UnauthorizedException('Contraseña incorrecta.')
			}
			const hashPassword = await bcrypt.hash(newPassword, +process.env.HASH_SALT)
			await this.userService.update(user.id, {
				...user,
				password: hashPassword,
			})

			return user
		} catch (error) {
			throw error
		}
	}
	@Post('reset-password')
	async resetPassword(@Body() { email }: { email: string }) {
		try {
			const user = await this.userService.findBy({
				key: 'email',
				value: email,
			})
			if (!user) {
				throw new UnauthorizedException(
					'El usuario no se encuentra registrado en base de datos.'
				)
			}

			const token = uuidv4()
			const expiration = new Date()
			expiration.setHours(expiration.getHours() + 24)

			await user.update({
				confirmationToken: token,
				confirmationTokenExpiresAt: expiration,
			})
			await user.save()

			await this.mailerSerivce.sendResetPassword(user.email, {
				name: `${user.name} ${user.lastName}`,
				token,
			})

			return 'Mail enviado correctamente!'
		} catch (error) {
			throw error
		}
	}
	// get-user-by-token
	@Post('get-user-by-token')
	async getUserbyToken(@Body() { token }: { token: string }) {
		try {
			const user = await this.userService.findBy({
				key: 'confirmationToken',
				value: token,
			})
			if (!user || user.confirmationTokenExpiresAt < new Date()) {
				throw new Error('Token inválido o expirado.')
			}

			return user
		} catch (error) {
			throw error
		}
	}
	@Post('confirmation')
	async confrimation(@Body() { token }: { token: string }) {
		try {
			const user = await this.userService.findBy({
				key: 'confirmationToken',
				value: token,
			})
			if (!user || user.confirmationTokenExpiresAt < new Date()) {
				throw new Error('Token inválido o expirado.')
			}

			user.emailConfirmed = true
			user.confirmationToken = null
			user.confirmationTokenExpiresAt = null
			await user.save()

			return 'Mail confirmado correctamente!'
		} catch (error) {
			throw error
		}
	}
	@Post('me')
	me(@Request() req: ExpressRequest) {
		return this.authService.me(req)
	}
}
