import { Inject, Injectable } from '@nestjs/common'
import { Company } from './schema/company.model'
import { COMPANY_REPOSITORY } from 'src/core/constants'
import { User } from 'src/user/schema/user.model'

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
		return this.comapnyModel.findAll({ include: { model: User } })
	}
	async getById(id: number): Promise<Company> {
		return this.comapnyModel.findByPk(id)
	}
	async create(data: Partial<Company>): Promise<Company> {
		return this.comapnyModel.create(data)
	}
	async delete(id: number): Promise<number> {
		return this.comapnyModel.destroy({ where: { id } })
	}
	async update(id: number, data: Partial<Company>) {
		return this.comapnyModel.update(data, { where: { id } })
	}
}
