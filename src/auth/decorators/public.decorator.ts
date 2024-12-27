import { SetMetadata } from '@nestjs/common'
import { PUBLIC_KEY } from 'src/core/constants/key-decorators'

export const PublicAcces = () => SetMetadata(PUBLIC_KEY, true)
