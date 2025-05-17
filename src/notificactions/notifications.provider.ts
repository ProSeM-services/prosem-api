import { NOTIFICATION_REPOSITORY } from 'src/core/constants'
import { Notification } from './schema/notifications.model'

export const notificationsProvider = [
	{
		provide: NOTIFICATION_REPOSITORY,
		useValue: Notification,
	},
]
