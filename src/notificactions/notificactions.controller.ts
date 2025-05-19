import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Request,
} from '@nestjs/common'
import { NotificactionsService } from './notificactions.service'
import { Request as ExpressRequest } from 'express'
import { AuthService } from 'src/auth/auth.service'
@Controller('notifications')
export class NotificactionsController {
	constructor(
		private readonly notificationService: NotificactionsService,
		private readonly authService: AuthService
	) {}

	@Get()
	async findAll(@Query('read') read: boolean, @Request() req: ExpressRequest) {
		const { EnterpriseId, role } = await this.authService.getDataFromToken(req)

		if (role !== 'MASTER') {
			return await this.notificationService.findAll(read, EnterpriseId)
		}
		return await this.notificationService.findAll(read)
	}

	@Post()
	async create(@Body() data: Partial<Notification>) {
		return await this.notificationService.create(data)
	}
	@Patch(':notificationId')
	async update(
		@Param() { notificationId }: { notificationId: string },
		@Body() data: Partial<Notification>
	) {
		return this.notificationService.update(notificationId, data)
	}
}
