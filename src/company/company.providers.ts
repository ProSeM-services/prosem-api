import { COMPANY_REPOSITORY } from 'src/core/constants'
import { Company } from './schema/company.model'

export const companyProviders = [
	{
		provide: COMPANY_REPOSITORY,
		useValue: Company,
	},
]
