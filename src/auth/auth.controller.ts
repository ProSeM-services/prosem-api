import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginAuthDto } from './dto/login-auth.dto'
import { UserDTO } from 'src/user/dto/user.dto'
import { CompanyService } from 'src/company/company.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly companyService: CompanyService
	) {}

	@Post('login')
	async login(@Body() { user, password }: LoginAuthDto) {
		const userValidate = await this.authService.validateUser(user, password)

		if (!userValidate) {
			throw new UnauthorizedException('Data not valid')
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
	async register(@Body() user: UserDTO) {
		try {
			const newUser = this.authService.register(user)

			return newUser
		} catch (error) {
			return error
		}
	}
	@Post('me')
	me(@Body() { token }: { token: string }) {
		return this.authService.me(token)
	}
}
