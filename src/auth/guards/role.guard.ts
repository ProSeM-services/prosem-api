import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth.service'
import {
	ADMIN_KEY,
	PUBLIC_KEY,
	ROLE_KEY,
} from 'src/core/constants/key-decorators'
import { ROLES, Role } from 'src/core/types/role'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly authServices: AuthService
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
		if (isPublic) return true

		const roleGuard = this.reflector.get<keyof typeof ROLES>(
			ROLE_KEY,
			context.getHandler()
		)

		const { role } = context.switchToHttp().getRequest<Request>()
		const userRole = role as Role

		if (!roleGuard || roleGuard !== userRole) {
			throw new UnauthorizedException('No tienes permisos para esta operacion')
		}

		return true
	}
}
