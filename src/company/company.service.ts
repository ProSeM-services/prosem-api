import { Inject, Injectable } from '@nestjs/common'
import { Company } from './schema/company.model'
import { COMPANY_REPOSITORY } from 'src/core/constants'
import { User } from 'src/user/schema/user.model'
import { Workhour } from 'src/workhours/schema/workhour.model'
import { literal } from 'sequelize'

@Injectable()
export class CompanyService {
	constructor(
		@Inject(COMPANY_REPOSITORY)
		private readonly companyModel: typeof Company
	) {}
	getHelloComapany(): string {
		return 'Hello company!'
	}
	async getAll(): Promise<Company[]> {
		return this.companyModel.findAll({ include: [User, Workhour] })
	}
	async getById(id: string): Promise<Company> {
		return await this.companyModel.findOne({
			where: { id },
			include: [User, Workhour],
		})
	}

	async getByName(searchTerm: string): Promise<Company[]> {
		return this.companyModel.findAll({
			where: literal(`"Company"."name" ILIKE '${searchTerm}%'`),
			include: [User, Workhour],
		})
	}
	async create(data: Partial<Company>): Promise<Company> {
		return this.companyModel.create(data)
	}
	async delete(id: string): Promise<number> {
		return this.companyModel.destroy({ where: { id } })
	}
	async update(id: string, data: Partial<Company>) {
		return this.companyModel.update(data, { where: { id } })
	}
}
