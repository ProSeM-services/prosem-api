import {
	CanActivate,
	ExecutionContext,
	Injectable,
	ForbiddenException,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Permission } from 'src/core/types/permissions'
import { ROLES } from 'src/core/types/role'
import { UserService } from 'src/user/user.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly userServices: UserService
	) {}

	async canActivate(context: ExecutionContext) {
		// Obtener el permiso requerido de los metadatos de la ruta
		const requiredPermission = this.reflector.get<Permission>(
			'permission',
			context.getHandler()
		)

		if (!requiredPermission) {
			// Si no se define un permiso, la ruta está abierta
			return true
		}

		// Obtener el usuario desde el request
		const { userId } = context.switchToHttp().getRequest<Request>()

		const user = await this.userServices.getById(userId)
		if (!user) {
			throw new UnauthorizedException('Usuario no autenticado')
		}

		// Verificar el permiso
		const rolePermissions = ROLES[user.role]?.permissions || []
		const userPermissions = user.permissions || []

		// Prioridad 1: Permisos individuales
		if (userPermissions.includes(requiredPermission)) {
			return true
		}
		if (userPermissions.includes(`!${requiredPermission}` as Permission)) {
			return false
		}

		// Prioridad 2: Permisos del rol
		if (rolePermissions.includes(requiredPermission)) {
			return true
		}

		// Si no tiene el permiso, lanzar excepción
		throw new UnauthorizedException('No tienes permisos necesarios.')
	}
}
