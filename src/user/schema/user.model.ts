import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
import { Permission } from 'src/core/types/permissions'
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
	@Column
	email: string
	@Column
	userName: string
	@Column
	phone: string

	@Column
	companyName: string
	@Column
	password: string
	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	emailConfirmed: boolean
	@Column({ type: DataType.BOOLEAN, defaultValue: true })
	membership_status: boolean
	@Column({ allowNull: true })
	confirmationToken: string
	@Column({ allowNull: true })
	confirmationTokenExpiresAt: Date
	@Column
	image: string
	@Column({
		type: DataType.ARRAY(DataType.JSON),
		defaultValue: [],
	})
	workhours: IWorkhour[]
	@Column({
		type: DataType.ARRAY(DataType.JSON),
		defaultValue: [],
	})
	permissions: Permission[]
	@Column({
		type: DataType.UUID,
	})
	CompanyId: string
}
