import { Module } from '@nestjs/common'
import { WebhookController } from './webhook.controller'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { PaymentsService } from 'src/payments/payments.service'
import { paymentProvider } from 'src/payments/payment.provider'
import { SubscriptionService } from 'src/subscription/subscription.service'
import { subscriptionProvider } from 'src/subscription/subscription.provider'
import { NotificactionsService } from 'src/notificactions/notificactions.service'
import { notificationsProvider } from 'src/notificactions/notifications.provider'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'

@Module({
	controllers: [WebhookController],
	providers: [
		AuthService,
		JwtService,
		PaymentsService,
		UserService,
		SubscriptionService,
		NotificactionsService,
		EnterpriseService,
		...enterpriseProvider,
		...notificationsProvider,
		...subscriptionProvider,
		...paymentProvider,
		...userProvider,
	],
})
export class WebhookModule {}
