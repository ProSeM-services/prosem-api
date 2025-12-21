import { ABSENCE_REPOSITORY } from 'src/core/constants'
import { Absence } from './schema/absence.model'

export const absenceProvider = [
	{
		provide: ABSENCE_REPOSITORY,
		useValue: Absence,
	},
]
