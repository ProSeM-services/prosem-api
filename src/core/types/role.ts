import { Permission } from './permissions'
export const ROLES_VALUES = ['BASIC', 'ADMIN', 'OWNER'] as const

export type Role = (typeof ROLES_VALUES)[number]

export const ROLES: Record<Role, { permissions: Permission[] }> = {
	OWNER: {
		permissions: Object.values(Permission), // Tiene acceso a todo
	},
	ADMIN: {
		permissions: [
			Permission.VIEW_COMPANY,
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
			Permission.VIEW_COMPANY,
			Permission.VIEW_MEMBERS,
			Permission.VIEW_SERVICES,
			Permission.VIEW_APPOINTMENTS,
			Permission.VIEW_WORKHOURS,
		],
	},
}

export enum ACCESS_LEVEL {
	DEVELOPER = 30,
	MANTEINER = 40,
	OWNER = 50,
}
