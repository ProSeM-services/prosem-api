export const ACCOUNT_TYPE_VALUES = ['BUSSINESS', 'PROFESSIONAL'] as const

export type AccountType = (typeof ACCOUNT_TYPE_VALUES)[number]
