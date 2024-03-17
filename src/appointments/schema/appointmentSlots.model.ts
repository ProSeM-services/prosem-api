import { Table, Column, DataType } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class AppoinmentSlots extends BaseModel<AppoinmentSlots> {
	@Column
	time: string
	@Column
	date: string
	@Column({ defaultValue: false })
	avaliable: boolean
	@Column({
		type: DataType.UUID,
	})
	UserId: string
}
