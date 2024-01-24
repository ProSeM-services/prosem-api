import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService, UserService, ...userProvider],
})
export class AuthModule {}
