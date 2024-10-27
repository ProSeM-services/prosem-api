import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class Customer extends BaseModel<Customer> {
	@Column
	firstName: string
	@Column
	lastName: string
	@Column({ unique: true })
	email: string
	@Column
	phone: string
}
