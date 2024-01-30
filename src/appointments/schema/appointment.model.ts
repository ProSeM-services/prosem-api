import { Table, Column } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table
export class Appointment extends BaseModel<Appointment> {
	@Column
	userId: string
	@Column
	companyId: string
	@Column
	name: string
	@Column
	phone: string
	@Column
	email: string
}
