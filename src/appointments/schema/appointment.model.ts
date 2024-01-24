import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript'
import { User } from 'src/user/schema/user.model'
@Table
export class Appointment extends Model<Appointment> {
	@ForeignKey(() => User)
	@Column({ field: 'userId' })
	userId: number
	@BelongsTo(() => User)
	company: User
	@Column
	tenantId: string
	@Column
	name: string
	@Column
	phone: string
	@Column
	email: string
}
