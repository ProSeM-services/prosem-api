import {
	Injectable,
	NestMiddleware,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserService } from 'src/user/user.service'

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
	constructor(
		private userServices: UserService,
		private jwtService: JwtService
	) {}
	public extractTokenFromHeader(request: Request) {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
	async use(req: Request, res: any, next: () => void) {
		const token = this.extractTokenFromHeader(req)

		if (!token) throw new UnauthorizedException('Missing token')

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWTKEY,
			})

			const { EnterpriseId } = payload

			const tenantExits = await this.userServices.getByTenantName(EnterpriseId)

			if (!tenantExits) {
				throw new NotFoundException('Tenant does not exist')
			}

			req['EnterpriseId'] = EnterpriseId
			next()
		} catch (error) {
			throw error
		}
	}
}
