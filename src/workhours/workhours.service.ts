import { Inject, Injectable } from '@nestjs/common'
import { Workhour } from './schema/workhour.model'
import { WORKHOUR_REPOSITORY } from 'src/core/constants'
import { WorkhourDto } from './dto/workhour.dto'

@Injectable()
export class WorkhoursService {
	constructor(
		@Inject(WORKHOUR_REPOSITORY) private readonly WorkhourModel: typeof Workhour
	) {}

	async getAll() {
		return await this.WorkhourModel.findAll()
	}
	async getByDay(data: WorkhourDto) {
		if (data.CompanyId && !data.UserId) {
			return await this.WorkhourModel.findOne({
				where: {
					CompanyId: data.CompanyId,
					day: data.day,
				},
			})
		} else if (!data.CompanyId && data.UserId) {
			return await this.WorkhourModel.findOne({
				where: {
					UserId: data.UserId,
					day: data.day,
				},
			})
		}
	}
	async create(data: Partial<Workhour>) {
		return await this.WorkhourModel.create(data)
	}
}
