import { ENTERPRISE_REPOSITORY } from 'src/core/constants'
import { Enterprise } from './schema/enterprise.model'

export const enterpriseProvider = [
	{
		provide: ENTERPRISE_REPOSITORY,
		useValue: Enterprise,
	},
]
