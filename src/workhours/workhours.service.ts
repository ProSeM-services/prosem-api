import { Inject, Injectable } from '@nestjs/common'
import { Workhour } from './schema/workhour.model'
import { WORKHOUR_REPOSITORY } from 'src/core/constants'

@Injectable()
export class WorkhoursService {
	constructor(
		@Inject(WORKHOUR_REPOSITORY) private readonly WorkhourModel: typeof Workhour
	) {}

	async getAll() {
		return await this.WorkhourModel.findAll()
	}
	async create(data: Partial<Workhour>) {
		return await this.WorkhourModel.create(data)
	}
}
