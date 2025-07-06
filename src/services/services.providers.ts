import { SERVICES_REPOSITORY } from 'src/core/constants'
import { Service } from './schema/service.model'

export const servicesProviders = [
	{
		provide: SERVICES_REPOSITORY,
		useValue: Service,
	},
]
