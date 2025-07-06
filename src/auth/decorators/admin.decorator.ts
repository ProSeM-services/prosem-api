import { SetMetadata } from '@nestjs/common'
import { ADMIN_KEY } from 'src/core/constants/key-decorators'
import { ROLES } from 'src/core/types/role'

export const AdminAcces = () => SetMetadata(ADMIN_KEY, ROLES.ADMIN)
