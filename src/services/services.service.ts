import { Injectable, Inject } from '@nestjs/common'
import { Service } from './schema/service.model'
import { SERVICES_REPOSITORY } from 'src/core/constants'
import { Company } from 'src/company/schema/company.model'
import { User } from 'src/user/schema/user.model'

@Injectable()
export class ServicesService {
	constructor(
		@Inject(SERVICES_REPOSITORY) private readonly serviceModel: typeof Service
	) {}

	async getAll(tenantName?: string): Promise<Service[]> {
		if (tenantName) {
			return await this.serviceModel.findAll({
				where: { tenantName },
				include: [User],
			})
		} else {
			return await this.serviceModel.findAll({ include: [User] })
		}
	}
	async getById(id: string): Promise<Service> {
		return await this.serviceModel.findOne({ where: { id }, include: [User] })
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
	async addMember(serviceId: string, memberId: string): Promise<void> {
		const service = await this.serviceModel.findByPk(serviceId)
		if (!service) {
			throw new Error('Service not found')
		}
		const member = await User.findByPk(memberId)
		if (!member) {
			throw new Error('Member not found')
		}
		await service.$add('users', member)
	}
	async removeMember(serviceId: string, memberId: string): Promise<void> {
		const service = await this.serviceModel.findByPk(serviceId)
		if (!service) {
			throw new Error('Service not found')
		}
		const member = await User.findByPk(memberId)
		if (!member) {
			throw new Error('Member not found')
		}
		await service.$remove('users', member)
	}

	async removeFromCompany(companyId: string, serviceId: string): Promise<void> {
		const service = await this.serviceModel.findByPk(serviceId)
		if (!service) {
			throw new Error('Service not found')
		}
		const company = await Company.findByPk(companyId)
		if (!company) {
			throw new Error('Company not found')
		}
		await service.$remove('companies', company)
	}

	async getByTitle(title: string): Promise<Service> {
		return await this.serviceModel.findOne({
			where: {
				title,
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
