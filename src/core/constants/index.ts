export { CORS } from './cors'
export const SEQUELIZE = 'SEQUELIZE'
export const USER_REPOSITORY = 'USER_REPOSITORY'
export const WORKHOUR_REPOSITORY = 'WORKHOUR_REPOSITORY'
export const COMPANY_REPOSITORY = 'COMPANY_REPOSITORY'
export const DEVELOPMENT = 'development'
export const TEST = 'test'
export const PRODUCTION = 'production'

export type enviromentType =
	| typeof DEVELOPMENT
	| typeof TEST
	| typeof PRODUCTION
