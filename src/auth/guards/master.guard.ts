import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { PUBLIC_KEY } from 'src/core/constants/key-decorators'
import { UserService } from 'src/user/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class MasterGuard implements CanActivate {
	constructor(
		private readonly userService: UserService,
		private readonly reflector: Reflector,
		private readonly authServices: AuthService
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
		if (isPublic) return true

		const req = context.switchToHttp().getRequest<Request>()

		const token = await this.authServices.getDataFromToken(req)
		req.userId = token.id
		req.role = token.role

		if (token.role !== 'MASTER') {
			throw new UnauthorizedException('No tienes permisos para esta operacion')
		}
		return true
	}
}
