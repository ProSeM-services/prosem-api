import { Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { ABSENCE_REPOSITORY } from 'src/core/constants'
import { Absence } from './schema/absence.model'

@Injectable()
export class AbsencesService {
	constructor(
		@Inject(ABSENCE_REPOSITORY)
		private readonly AbsenceModel: typeof Absence
	) {}

	async create(data: Partial<Absence>) {
		return this.AbsenceModel.create(data)
	}

	async getById(id: string) {
		return this.AbsenceModel.findOne({ where: { id } })
	}

	async delete(id: string) {
		return this.AbsenceModel.destroy({ where: { id } })
	}

	async getByUser(UserId: string) {
		return this.AbsenceModel.findAll({
			where: { UserId },
			order: [['startDate', 'ASC']],
		})
	}

	async findForDate(UserId: string, date: string) {
		const dateOnly = date.split('T')[0]
		return this.AbsenceModel.findOne({
			where: {
				UserId,
				startDate: { [Op.lte]: dateOnly },
				endDate: { [Op.gte]: dateOnly },
			},
		})
	}

	async findOverlapping(UserId: string, startDate: string, endDate: string) {
		return this.AbsenceModel.findOne({
			where: {
				UserId,
				[Op.or]: [
					{ startDate: { [Op.between]: [startDate, endDate] } },
					{ endDate: { [Op.between]: [startDate, endDate] } },
					{ startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } },
				],
			},
		})
	}

	async getByEnterprise(EnterpriseId: string) {
		return this.AbsenceModel.findAll({
			where: { EnterpriseId },
			order: [['startDate', 'ASC']],
		})
	}
}
