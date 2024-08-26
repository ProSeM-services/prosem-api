import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { IAuthResponse, IPayloadToken } from './interface/auth.interface'
import { User } from 'src/user/schema/user.model'
import { UserDTO } from 'src/user/dto/user.dto'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService
	) {}

	public async register(user: UserDTO) {
		const hashPassword = await bcrypt.hash(user.password, +process.env.HASH_SALT)
		const data: UserDTO = {
			...user,
			password: hashPassword,
			tenantName: user.companyName
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(''),
		}

		return await this.userService.create(data)
	}
	public async validateUser(userName: string, password: string) {
		const userByUsername = await this.userService.findBy({
			key: 'userName',
			value: userName,
		})
		const userByEmail = await this.userService.findBy({
			key: 'email',
			value: userName,
		})

		if (userByUsername) {
			const match = await bcrypt.compare(password, userByUsername.password)
			if (match) return userByUsername
		}

		if (userByEmail) {
			const match = await bcrypt.compare(password, userByEmail.password)
			if (match) return userByEmail
		}

		return null
	}

	public signJWT({
		payload,
		secret,
	}: {
		payload: jwt.JwtPayload
		secret: string
	}): string {
		return jwt.sign(payload, secret, { noTimestamp: true })
	}

	public async generateJWT(user: User): Promise<IAuthResponse> {
		const getUser = await this.userService.getById(user.id)

		const payload: IPayloadToken = {
			id: getUser.id,
			name: getUser.name,
			email: getUser.email,
			lastName: getUser.lastName,
			role: getUser.role,
			image: getUser.image,
			userName: getUser.userName,
			tenantName: getUser.tenantName,
		}

		return {
			accessToken: this.signJWT({
				payload,
				secret: process.env.JWTKEY,
			}),
			user: payload,
		}
	}

	public async me(token: string) {
		const payload = jwt.verify(token, process.env.JWTKEY)

		if (!payload) {
			throw new UnauthorizedException('Invalid token')
		}

		return payload
	}

	async getTenantFromHeaders(request: Request) {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		if (!token) throw new UnauthorizedException()
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWTKEY,
			})

			const { tenantName } = payload

			if (!tenantName) {
				throw new NotFoundException('Tenant does not exist')
			}
			return tenantName
		} catch (error) {
			throw new UnauthorizedException()
		}
	}
}
