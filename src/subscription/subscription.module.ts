import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { subscriptionProvider } from './subscription.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'

@Module({
	controllers: [SubscriptionController],
	providers: [
		SubscriptionService,
		AuthService,
		JwtService,
		UserService,
		EnterpriseService,
		...subscriptionProvider,
		...userProvider,
		...enterpriseProvider,
	],
})
export class SubscriptionModule {}
