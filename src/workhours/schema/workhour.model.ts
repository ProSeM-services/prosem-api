import { DataTypes } from 'sequelize'
import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class Workhour extends BaseModel<Workhour> {
	@Column
	day: number

	@Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
	hours: string[]

	@Column({ type: DataType.UUID, allowNull: true })
	CompanyId: string | null

	@Column({ type: DataType.UUID, allowNull: true })
	UserId: string | null
}
