import { Injectable, Inject } from '@nestjs/common'
import { Service } from './schema/service.model'
import { SERVICES_REPOSITORY } from 'src/core/constants'
import { Op } from 'sequelize'
import { Company } from 'src/company/schema/company.model'

@Injectable()
export class ServicesService {
	constructor(
		@Inject(SERVICES_REPOSITORY) private readonly serviceModel: typeof Service
	) {}

	async getAll(): Promise<Service[]> {
		return await this.serviceModel.findAll()
	}

	async addToCompany(companyId: string, serviceId: string): Promise<void> {
		const service = await this.serviceModel.findByPk(serviceId)
		if (!service) {
			throw new Error('Service not found')
		}
		const company = await Company.findByPk(companyId)
		if (!company) {
			throw new Error('Company not found')
		}
		await service.$add('companies', company)
	}

	async getById(id: string): Promise<Service> {
		return await this.serviceModel.findOne({ where: { id } })
	}

	async getByTitle(title: string): Promise<Service[]> {
		return await this.serviceModel.findAll({
			where: {
				title: {
					[Op.iLike]: `%${title}%`,
				},
			},
		})
	}

	async create(data: Partial<Service>): Promise<Service> {
		return await this.serviceModel.create(data)
	}

	async update(
		id: string,
		data: Partial<Service>
	): Promise<[number, Service[]]> {
		return await this.serviceModel.update(data, {
			where: { id },
			returning: true,
		})
	}

	async delete(id: string): Promise<number> {
		return await this.serviceModel.destroy({ where: { id } })
	}
}
