import { DataTypes } from 'sequelize'
import { Table, Column } from 'sequelize-typescript'
import { Location } from '../interfaces/location.interface'
import { IWorkhour } from 'src/core/types/workhours'
import { Category } from '../interfaces/categeory.interface'
import { BaseModel } from 'src/core/database/schema/base.model'

@Table({ timestamps: true })
export class Company extends BaseModel<Company> {
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
	name: string
	@Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
	payment_methods: string[]

	@Column({
		type: DataTypes.JSON,
		allowNull: false,
	})
	address: Location

	@Column({
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: false,
		validate: {
			max: 3,
		},
	})
	category: Category[]

	@Column({
		type: DataTypes.ARRAY(DataTypes.JSON),
		defaultValue: [],
	})
	workhours: IWorkhour[]

	@Column({
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	})
	status: boolean

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	email: string
	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	city: string

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	image?: string
	@Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
	images: string[]
	@Column({
		type: DataTypes.UUID,
	})
	EnterpriseId: string
}

export { Company as CompanyDocument, Company as CompanyModel }
