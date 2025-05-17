import { Inject, Injectable } from '@nestjs/common'
import { NOTIFICATION_REPOSITORY } from 'src/core/constants'
import { Notification } from './schema/notifications.model'

export class NotificactionsService {
	constructor(
		@Inject(NOTIFICATION_REPOSITORY)
		private readonly notificationsModel: typeof Notification
	) {}

	async findAll(read?: boolean) {
		if (read) {
			return await this.notificationsModel.findAll({ where: { read } })
		}
		return await this.notificationsModel.findAll()
	}
	async create(data: Partial<Notification>) {
		return await this.notificationsModel.create(data)
	}
}
