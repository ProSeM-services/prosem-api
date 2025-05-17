import { Permission } from './permissions'
export const ROLES_VALUES = ['BASIC', 'ADMIN', 'OWNER', 'MASTER'] as const

export type Role = (typeof ROLES_VALUES)[number]

export const ROLES: Record<Role, { permissions: Permission[] }> = {
	OWNER: {
		permissions: Object.values(Permission), // Tiene acceso a todo
	},
	MASTER: {
		permissions: Object.values(Permission),
	},
	ADMIN: {
		permissions: [
			Permission.VIEW_PAYMENTS,
			Permission.CREATE_PAYMENTS,
			Permission.UPDATE_PAYMENTS,
			Permission.DELETE_PAYMENTS,
			Permission.VIEW_ENTERPRISES,
			Permission.CREATE_ENTERPRISES,
			Permission.UPDATE_ENTERPRISES,
			Permission.DELETE_ENTERPRISES,
			Permission.CREATE_COMPANY,
			Permission.VIEW_COMPANY,
			Permission.UPDATE_COMPANY,
			Permission.DELETE_COMPANY,
			Permission.CREATE_MEMBERS,
			Permission.VIEW_MEMBERS,
			Permission.VIEW_SERVICES,
			Permission.CREATE_APPOINTMENTS,
			Permission.UPDATE_APPOINTMENTS,
			Permission.DELETE_APPOINTMENTS,
			Permission.VIEW_APPOINTMENTS,
			Permission.CREATE_WORKHOURS,
			Permission.UPDATE_WORKHOURS,
			Permission.DELETE_WORKHOURS,
			Permission.VIEW_WORKHOURS,
		],
	},
	BASIC: {
		permissions: [
			Permission.VIEW_APPOINTMENTS,
			Permission.VIEW_WORKHOURS,
			Permission.VIEW_CUSTOMERS,
		],
	},
}

export enum ACCESS_LEVEL {
	DEVELOPER = 30,
	MANTEINER = 40,
	OWNER = 50,
}
