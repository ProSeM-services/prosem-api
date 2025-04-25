import { Inject, Injectable } from '@nestjs/common'
import { CreateEnterpriseDto } from './dto/create-enterprise.dto'
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto'
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

	update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
		return `This action updates a #${id} enterprise`
	}

	remove(id: number) {
		return `This action removes a #${id} enterprise`
	}
}
