import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class Appointment extends BaseModel<Appointment> {
	@Column
	name: string
	@Column
	lastName: string
	@Column
	phone: string
	@Column
	email: string
	@Column
	date: string
	@Column
	time: string
	@Column
	cancelationToken: string
	@Column
	canceled: boolean
	@Column
	duration: number
	@Column({
		type: DataType.UUID,
	})
	UserId: string
	@Column({
		type: DataType.UUID,
	})
	ServiceId: string
	@Column({
		type: DataType.UUID,
	})
	CustomerId: string
	@Column({
		type: DataType.UUID,
	})
	companyId: string
}
