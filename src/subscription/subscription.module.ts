import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { subscriptionProvider } from './subscription.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [SubscriptionController],
	providers: [
		SubscriptionService,
		AuthService,
		JwtService,
		UserService,
		...subscriptionProvider,
		...userProvider,
	],
})
export class SubscriptionModule {}
