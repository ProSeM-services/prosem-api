import { DataTypes } from 'sequelize'
import { Table, Column } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class Company extends BaseModel<Company> {
	@Column({
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string

	@Column
	name: string
	@Column({ unique: true, allowNull: true })
	dbUrl: string

	@Column({ unique: true })
	email: string

	@Column
	address: string

	@Column
	image: string
}
