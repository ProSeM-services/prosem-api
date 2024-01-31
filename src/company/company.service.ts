import { Inject, Injectable } from '@nestjs/common'
import { Company } from './schema/company.model'
import { COMPANY_REPOSITORY } from 'src/core/constants'
import { User } from 'src/user/schema/user.model'
import { Workhour } from 'src/workhours/schema/workhour.model'

@Injectable()
export class CompanyService {
	constructor(
		@Inject(COMPANY_REPOSITORY)
		private readonly comapnyModel: typeof Company
	) {}
	getHelloComapany(): string {
		return 'Hello company!'
	}
	async getAll(): Promise<Company[]> {
		return this.comapnyModel.findAll({ include: [User, Workhour] })
	}
	async getById(id: string): Promise<Company> {
		return await this.comapnyModel.findOne({
			where: { id },
			include: { model: User },
		})
	}

	async create(data: Partial<Company>): Promise<Company> {
		return this.comapnyModel.create(data)
	}
	async delete(id: string): Promise<number> {
		return this.comapnyModel.destroy({ where: { id } })
	}
	async update(id: string, data: Partial<Company>) {
		return this.comapnyModel.update(data, { where: { id } })
	}
}
