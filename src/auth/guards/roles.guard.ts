import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth.service'
import { PUBLIC_KEY, ROLES_KEY } from 'src/core/constants/key-decorators'
import { ROLES_VALUES } from 'src/core/types/role'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly authServices: AuthService
	) {}
	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
		if (isPublic) return true

		const roles = this.reflector.get<Array<keyof typeof ROLES_VALUES>>(
			ROLES_KEY,
			context.getHandler()
		)

		const { role } = context.switchToHttp().getRequest<Request>()

		if (!roles) {
		}
		return true
	}
}
