import { SetMetadata } from '@nestjs/common'
import { ROLES_KEY, ROLE_KEY } from 'src/core/constants/key-decorators'
import { ROLES } from 'src/core/types/role'

export const Roles = (...roles: Array<keyof typeof ROLES>) =>
	SetMetadata(ROLES_KEY, roles)

export const Role = (role: keyof typeof ROLES) => SetMetadata(ROLE_KEY, role)
