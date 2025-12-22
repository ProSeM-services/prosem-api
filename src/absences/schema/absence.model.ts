import { Column, DataType, Table } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'

@Table
export class Absence extends BaseModel<Absence> {
	@Column({ type: DataType.DATEONLY })
	startDate: string

	@Column({ type: DataType.DATEONLY })
	endDate: string

	@Column({ allowNull: true })
	reason?: string

	@Column({
		type: DataType.UUID,
	})
	UserId: string

	@Column({
		type: DataType.UUID,
	})
	EnterpriseId: string
}
