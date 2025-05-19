import { Module } from '@nestjs/common'
import { NotificactionsController } from './notificactions.controller'
import { NotificactionsService } from './notificactions.service'
import { notificationsProvider } from './notifications.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [NotificactionsController],
	providers: [
		NotificactionsService,
		AuthService,
		JwtService,
		UserService,
		...userProvider,
		...notificationsProvider,
	],
})
export class NotificactionsModule {}
