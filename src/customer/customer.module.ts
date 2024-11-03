import { Module } from '@nestjs/common'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { customerProvider } from './customer.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [CustomerController],
	providers: [
		CustomerService,
		AuthService,
		JwtService,
		UserService,
		...customerProvider,
		...userProvider,
	],
})
export class CustomerModule {}
