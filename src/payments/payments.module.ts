import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { paymentProvider } from './payment.provider'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { NotificactionsService } from 'src/notificactions/notificactions.service'
import { notificationsProvider } from 'src/notificactions/notifications.provider'

@Module({
	controllers: [PaymentsController],
	providers: [
		PaymentsService,
		EnterpriseService,
		AuthService,
		JwtService,
		UserService,
		NotificactionsService,
		...notificationsProvider,
		...userProvider,
		...enterpriseProvider,
		...paymentProvider,
	],
})
export class PaymentsModule {}
