// Modelo base para todos los modelos de Reserve Pro
import {
	Table,
	Column,
	Model,
	PrimaryKey,
	DataType,
	BeforeCreate,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid'

@Table
export class BaseModel<T> extends Model<T> {
	@PrimaryKey
	@Column({
		type: DataType.UUID,
	})
	id: string

	@Column
	tenantName: string

	@BeforeCreate
	static generateId(instance: BaseModel<any>) {
		if (!instance.id) {
			instance.id = uuidv4()
		}
	}
}
