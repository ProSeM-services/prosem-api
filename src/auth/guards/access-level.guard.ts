import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth.service'
import {
	ACCESS_LEVEL_KEY,
	ADMIN_KEY,
	PUBLIC_KEY,
	ROLES_KEY,
} from 'src/core/constants/key-decorators'
import { ROLES, ROLES_VALUES } from 'src/core/types/role'
import { Request } from 'express'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AcessLevelGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly userService: UserService
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
		if (isPublic) return true

		const roles = this.reflector.get<Array<keyof typeof ROLES>>(
			ROLES_KEY,
			context.getHandler()
		)
		const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler())
		const accessLevel = this.reflector.get<number>(
			ACCESS_LEVEL_KEY,
			context.getHandler()
		)
		const { role, userId } = context.switchToHttp().getRequest<Request>()

		if (!roles && !accessLevel) {
			if (!admin) {
				return true
			} else if (admin && role === admin) {
				return true
			} else {
				throw new UnauthorizedException('No tienes permisos para esta operacion')
			}
		}

		if (role === ROLES.ADMIN || role === ROLES.OWNER) {
			return true
		}

		const isAuth = roles.some((value) => value === role)

		if (!isAuth) {
			throw new UnauthorizedException('No tienes permisos para esta operacion')
		}

		const user = await this.userService.getById(userId)

		return true
	}
}
