import { DataTypes } from 'sequelize'
import { Table, Column, Model } from 'sequelize-typescript'
import { Provision } from '../interfaces/provision.interface'

@Table({ timestamps: true })
export class Service extends Model<Service> {
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
		type: DataTypes.UUID,
	})
	CompanyId: string
}
