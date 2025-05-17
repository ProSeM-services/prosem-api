import { Module } from '@nestjs/common'
import { NotificactionsController } from './notificactions.controller'
import { NotificactionsService } from './notificactions.service'
import { notificationsProvider } from './notifications.provider'

@Module({
	controllers: [NotificactionsController],
	providers: [NotificactionsService, ...notificationsProvider],
})
export class NotificactionsModule {}
