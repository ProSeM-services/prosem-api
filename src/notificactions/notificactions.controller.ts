import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { NotificactionsService } from './notificactions.service'

@Controller('notifications')
export class NotificactionsController {
	constructor(private readonly notificationService: NotificactionsService) {}

	@Get()
	findAll(@Query('read') read: boolean) {
		return this.notificationService.findAll(read)
	}

	@Post()
	create(@Body() data: Partial<Notification>) {
		return this.notificationService.create(data)
	}
}
