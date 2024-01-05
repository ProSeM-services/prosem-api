import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { userProvider } from './user.provider'

@Module({
	controllers: [UserController],
	providers: [UserService, ...userProvider],
})
export class UserModule {}
