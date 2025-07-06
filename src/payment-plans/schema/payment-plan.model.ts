import { Column, Table } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'

@Table
export class PaymentPlan extends BaseModel<PaymentPlan> {
	// Define your payment plan properties here
	// For example:
	@Column({ allowNull: false, unique: true })
	name: string

	@Column({ allowNull: false })
	price: number

	@Column({ allowNull: false })
	duration: number // number of months or days for the plan duration.

	@Column({ defaultValue: 1, allowNull: false })
	company_limit: number // Indicates if the payment plan is currently active

	@Column({ allowNull: true })
	description: string

	@Column({ defaultValue: true })
	isActive: boolean // Indicates if the payment plan is currently active

	// Add any other relevant fields for the payment plan
}
