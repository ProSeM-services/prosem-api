import { SetMetadata } from '@nestjs/common'
import { ACCESS_LEVEL_KEY } from 'src/core/constants/key-decorators'
export const AcessLevel = (level: number) =>
	SetMetadata(ACCESS_LEVEL_KEY, level)
