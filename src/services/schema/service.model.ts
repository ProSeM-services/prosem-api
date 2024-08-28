import { DataTypes } from 'sequelize'
import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript'
import { Provision } from '../interfaces/provision.interface'
import { BaseModel } from 'src/core/database/schema/base.model'
import { Company } from 'src/company/schema/company.model'

@Table({ timestamps: true })
export class Service extends BaseModel<Service> {
	@Column({
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string

	@Column({
		type: DataTypes.STRING,
		allowNull: false,
	})
	title: string

	@Column({
		type: DataTypes.INTEGER,
		allowNull: false,
	})
	duration: number

	@Column({
		type: DataTypes.FLOAT,
		allowNull: false,
	})
	price: number

	@Column({
		type: DataTypes.STRING,
	})
	provision: Provision

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	description: string

	@Column({
		type: DataTypes.ARRAY(DataTypes.JSON),
		allowNull: true,
	})
	companies: Company[]
}
