import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class User extends BaseModel<User> {
	@Column
	name: string
	@Column({ defaultValue: undefined })
	role: string | undefined
	@Column
	lastName: string
	@Column({ unique: true })
	email: string
	@Column({ unique: true })
	userName: string
	@Column({ unique: true })
	password: string
	@Column
	image: string
	@Column({
		type: DataType.UUID,
	})
	CompanyId: string
}
