import { Table, Column, DataType } from 'sequelize-typescript'
import { Location } from 'src/company/interfaces/location.interface'
import { BaseModel } from 'src/core/database/schema/base.model'

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
}
