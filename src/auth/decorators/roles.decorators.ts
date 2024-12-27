import { SetMetadata } from '@nestjs/common'
import { PUBLIC_KEY, ROLES_KEY } from 'src/core/constants/key-decorators'
import { ROLES_VALUES } from 'src/core/types/role'

export const Roles = (...roles: Array<keyof typeof ROLES_VALUES>) =>
	SetMetadata(ROLES_KEY, roles)
