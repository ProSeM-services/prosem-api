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
	@Column({
		type: DataType.FLOAT, // O DataType.DECIMAL(10,2) si necesitas más precisión
	})
	price: number
	@Column
	canceled: boolean
	@Column({ defaultValue: false })
	confirmed: boolean
	@Column
	payment_method: string
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
