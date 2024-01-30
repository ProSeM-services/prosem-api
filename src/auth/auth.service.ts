import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { IAuthResponse, IPayloadToken } from './interface/auth.interface'
import { User } from 'src/user/schema/user.model'
@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

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
			companyId: getUser.CompanyId,
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
			throw new UnauthorizedException('Token invalido')
		}

		return payload
	}
}
