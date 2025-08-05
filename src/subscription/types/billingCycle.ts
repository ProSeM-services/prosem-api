import { z } from 'zod'

export const BILING_CYCLE_OPTIONS = ['monthly', 'quarterly', 'yearly'] as const

export const BilingSchema = z.enum(BILING_CYCLE_OPTIONS)
export type TBilingCycle = z.infer<typeof BilingSchema>
