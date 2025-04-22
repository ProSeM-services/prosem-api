import { Inject, Injectable } from '@nestjs/common'
import { Company } from './schema/company.model'
import { COMPANY_REPOSITORY } from 'src/core/constants'
import { User } from 'src/user/schema/user.model'
import { literal } from 'sequelize'
import { Op } from 'sequelize'
import { Service } from 'src/services/schema/service.model'

@Injectable()
export class CompanyService {
	constructor(
		@Inject(COMPANY_REPOSITORY) private readonly companyModel: typeof Company
	) {}

	getHelloComapany(): string {
		return 'Hello company!'
	}

	async getCompanies({
		name,
		category,
		city,
	}: {
		name: string
		category: string
		city: string
	}): Promise<Company[]> {
		const whereClause: any = {}
		if (name && name.length) {
			whereClause.name = {
				[Op.iLike]: `%${name}%`,
			}
		}

		if (category && category.length) {
			whereClause.category = {
				[Op.contains]: [category],
			}
		}

		if (city && city.length) {
			whereClause.city = {
				[Op.iLike]: `%${city}%`,
			}
		}

		return await this.companyModel.findAll({
			where: { ...whereClause },
			include: [User, Service],
		})
	}
	async getAll(tenantName?: string): Promise<Company[]> {
		if (!tenantName)
			return await this.companyModel.findAll({ include: [User, Service] })
		return await this.companyModel.findAll({
			where: { tenantName },
			include: [User, Service],
		})
	}
	async getById(id: string): Promise<Company> {
		return await this.companyModel.findOne({
			where: { id },
			include: [User, Service],
		})
	}

	async getByName(searchTerm: string): Promise<Company[]> {
		return this.companyModel.findAll({
			where: literal(`"Company"."name" ILIKE '${searchTerm}%'`),
			include: [User, Service],
		})
	}
	async create(data: Partial<Company>): Promise<Company> {
		return await this.companyModel.create(data)
	}
	async delete(id: string): Promise<number> {
		return this.companyModel.destroy({ where: { id } })
	}
	async update(id: string, data: Partial<Company>) {
		return this.companyModel.update(data, { where: { id } })
	}

	async addService(companyId: string, serviceId: string): Promise<void> {
		const company = await this.companyModel.findByPk(companyId)
		if (!company) {
			throw new Error('Company not found')
		}
		await company.$add('services', serviceId)
	}

	async removeService(companyId: string, serviceId: string): Promise<void> {
		const company = await this.companyModel.findByPk(companyId)
		if (!company) {
			throw new Error('Company not found')
		}
		await company.$remove('services', serviceId)
	}
}
