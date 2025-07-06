import { SetMetadata } from '@nestjs/common'
import { Permission } from 'src/core/types/permissions'

export const RequiresPermission = (permission: Permission) =>
	SetMetadata('permission', permission)
