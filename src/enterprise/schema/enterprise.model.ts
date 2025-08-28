import { Table, Column, DataType } from 'sequelize-typescript'
import { Location } from 'src/company/interfaces/location.interface'
import { BaseModel } from 'src/core/database/schema/base.model'
import { EnterpriseStatusEnum } from '../constants/enterprise-status.constants'

@Table
export class Enterprise extends BaseModel<Enterprise> {
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string
	@Column({
		type: DataType.JSON,
		allowNull: false,
	})
	address: Location
	@Column({
		type: DataType.FLOAT,
		allowNull: false,
		defaultValue: 0,
	})
	membership_price: number
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	email: string

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	company_count: number

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	website: string
	@Column({
		type: DataType.ENUM(...Object.values(EnterpriseStatusEnum)),
		allowNull: true,
		defaultValue: EnterpriseStatusEnum.FREE,
	})
	stauts: EnterpriseStatusEnum
	@Column({
		type: DataType.UUID,
		allowNull: true,
	})
	payment_plan: string
	@Column({ defaultValue: 1, allowNull: true })
	company_limit: number // Indicates the number of available companies
}
