import { Inject, Injectable } from '@nestjs/common'
import { Enterprise } from './schema/enterprise.model'
import { ENTERPRISE_REPOSITORY } from 'src/core/constants'

@Injectable()
export class EnterpriseService {
	constructor(
		@Inject(ENTERPRISE_REPOSITORY)
		private readonly enterpriseModel: typeof Enterprise
	) {}
	async create(data: Partial<Enterprise>) {
		return await this.enterpriseModel.create(data)
	}

	async findAll() {
		return await this.enterpriseModel.findAll()
	}

	async findOne(id: string) {
		return await this.enterpriseModel.findOne({ where: { id } })
	}

	async update(id: string, data: Partial<Enterprise>) {
		return await this.enterpriseModel.update(data, { where: { id } })
	}

	remove(id: string) {
		return `This action removes a #${id} enterprise`
	}
}
