import { DataTypes } from 'sequelize'
import { Table, Column } from 'sequelize-typescript'
import { BaseModel } from 'src/core/database/schema/base.model'
@Table({ timestamps: true })
export class Notification extends BaseModel<Notification> {
	@Column({ type: DataTypes.STRING, allowNull: false })
	title: string

	@Column({ type: DataTypes.TEXT, allowNull: false })
	message: string

	@Column({ type: DataTypes.BOOLEAN, defaultValue: false })
	read: boolean

	@Column({ type: DataTypes.UUID })
	relatedEntityId: string // id del pago, turno, etc.

	@Column({ type: DataTypes.STRING })
	type: 'payment' | 'appointment' | 'system' // tipo de notificación

	@Column({ type: DataTypes.UUID })
	adminId: string // si es multiadmin

	@Column({ type: DataTypes.UUID })
	EnterpriseId: string // empresa que generó el evento
}
