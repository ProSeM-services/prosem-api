import { Module } from '@nestjs/common'
import { PaymentPlansController } from './payment-plans.controller'
import { PaymentPlansService } from './payment-plans.service'
import { paymentPlansProvider } from './payment-pants.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { userProvider } from 'src/user/user.provider'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [PaymentPlansController],
	providers: [
		PaymentPlansService,
		AuthService,
		JwtService,
		UserService,
		...userProvider,
		...paymentPlansProvider,
	],
})
export class PaymentPlansModule {}
