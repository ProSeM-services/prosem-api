export const ENTERPRISE_STATUS_VALUES = ['ACTIVE', 'INACTIVE', 'FREE'] as const

export type EnterpriseStatus = (typeof ENTERPRISE_STATUS_VALUES)[number]

export enum EnterpriseStatusEnum {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	FREE = 'FREE',
}
