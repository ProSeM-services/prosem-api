import { DataTypes } from 'sequelize'
import { Table, Column, ForeignKey } from 'sequelize-typescript'

import { Company } from 'src/company/schema/company.model'
import { BaseModel } from 'src/core/database/schema/base.model'
import { User } from 'src/user/schema/user.model'
@Table
export class Workhour extends BaseModel<Workhour> {
	@Column
	day: number

	@Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
	hours: string[]

	@ForeignKey(() => Company)
	@Column({ allowNull: true, field: 'id' })
	companyId: string

	@ForeignKey(() => User)
	@Column({ allowNull: true, field: 'id' })
	userId: string
}
