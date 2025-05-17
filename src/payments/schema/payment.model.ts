import { DataTypes } from 'sequelize'
import { Table, Column } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
import { PaymentStatus } from '../constants/payment-status'

@Table({ timestamps: true })
export class Payment extends BaseModel<Payment> {
	@Column({
		type: DataTypes.INTEGER,
		allowNull: false,
	})
	amount: number

	@Column({
		allowNull: false,
	})
	date: string
	@Column({
		type: DataTypes.UUID,
	})
	EnterpriseId: string
	@Column({
		type: DataTypes.UUID,
		allowNull: false,
	})
	payment_by: string
	@Column({
		allowNull: false,
	})
	start_date: string

	@Column({
		allowNull: false,
	})
	end_date: string

	@Column({
		type: DataTypes.ENUM(...Object.values(PaymentStatus)),
		allowNull: false,
		defaultValue: PaymentStatus.PAID,
	})
	status: PaymentStatus

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	payment_method: string

	@Column({
		type: DataTypes.TEXT,
		allowNull: true,
	})
	notes: string
}
