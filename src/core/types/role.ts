export enum ROLES {
	BASIC = 'BASIC',
	OWNER = 'OWNER',
	ADMIN = 'ADMIN',
}

export const ROLES_VALUES = ['BASIC', 'ADMIN', 'OWNER'] as const

export type Role = (typeof ROLES_VALUES)[number]

export enum ACCESS_LEVEL {
	DEVELOPER = 30,
	MANTEINER = 40,
	OWNER = 50,
}
