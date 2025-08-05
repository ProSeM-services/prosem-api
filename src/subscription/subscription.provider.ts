import { SUBSCRIPTION_REPOSITORY } from 'src/core/constants'
import { Subscription } from './schema/subscription.model'

export const subscriptionProvider = [
	{
		provide: SUBSCRIPTION_REPOSITORY,
		useValue: Subscription,
	},
]
