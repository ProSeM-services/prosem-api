import { SetMetadata } from '@nestjs/common'
import {
	ADMIN_KEY,
	PUBLIC_KEY,
	ROLES_KEY,
} from 'src/core/constants/key-decorators'
import { ROLES_VALUES } from 'src/core/types/role'

export const AdminAcces = (...roles: Array<keyof typeof ROLES_VALUES>) =>
	SetMetadata(ADMIN_KEY, ROLES_VALUES[1])
