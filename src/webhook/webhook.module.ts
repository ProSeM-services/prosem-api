import { Module } from '@nestjs/common'
import { WebhookController } from './webhook.controller'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { PaymentsService } from 'src/payments/payments.service'
import { paymentProvider } from 'src/payments/payment.provider'

@Module({
	controllers: [WebhookController],
	providers: [
		AuthService,
		JwtService,
		PaymentsService,
		UserService,
		...paymentProvider,
		...userProvider,
	],
})
export class WebhookModule {}
