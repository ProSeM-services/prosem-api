import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
import { Role, ROLES_VALUES } from 'src/core/types/role'
import { IWorkhour } from 'src/core/types/workhours'
@Table
export class User extends BaseModel<User> {
	@Column
	name: string
	@Column({
		type: DataType.ENUM(...Object.values(ROLES_VALUES)),
		allowNull: false,
	})
	role: Role
	@Column
	lastName: string
	@Column({ unique: true })
	email: string
	@Column({ unique: true })
	userName: string
	@Column
	phone: string

	@Column
	companyName: string
	@Column({ unique: true })
	password: string
	@Column
	image: string
	@Column({
		type: DataType.ARRAY(DataType.JSON),
		defaultValue: [],
	})
	workhours: IWorkhour[]
	@Column({
		type: DataType.UUID,
	})
	CompanyId: string
}
