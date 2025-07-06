import { SetMetadata } from '@nestjs/common'
import { MASTER_KEY } from 'src/core/constants/key-decorators'
import { ROLES } from 'src/core/types/role'

export const MasterAccess = () => SetMetadata(MASTER_KEY, ROLES.MASTER)
