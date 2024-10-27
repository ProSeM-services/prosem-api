import { CUSTOMERS_REPOSITORY } from 'src/core/constants'
import { Customer } from './schema/customer.model'

export const customerProvider = [
	{
		provide: CUSTOMERS_REPOSITORY,
		useValue: Customer,
	},
]
