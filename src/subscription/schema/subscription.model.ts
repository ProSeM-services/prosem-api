import { DataTypes } from 'sequelize'
import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
import { TBilingCycle } from '../types/billingCycle'
import { TSubscriptionStatus } from '../types/subscriptionStatus'

@Table
export class Subscription extends BaseModel<Subscription> {
	@Column
	billingCycle: TBilingCycle
	@Column
	startDate: string
	@Column
	endDate: string
	@Column
	amount: number
	@Column({ defaultValue: 0 })
	discountApplied: number
	@Column({ defaultValue: 'active' })
	status: TSubscriptionStatus
	@Column({ type: DataTypes.UUID })
	EnterpriseId: string // empresa que generó el evento
	@Column({ type: DataTypes.UUID })
	PlanId: string // Plan asociado a la subscripcion
}
