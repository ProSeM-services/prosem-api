import { WORKHOUR_REPOSITORY } from 'src/core/constants'
import { Workhour } from './schema/workhour.model'

export const workhourProvider = [
	{
		provide: WORKHOUR_REPOSITORY,
		useValue: Workhour,
	},
]
