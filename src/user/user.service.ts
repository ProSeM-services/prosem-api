import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/core/constants'
import { User } from './schema/user.model'
import { Appointment } from 'src/appointments/schema/appointment.model'
@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY) private readonly UserModel: typeof User
	) {}

	async getAll(tenantName: string): Promise<User[]> {
		return this.UserModel.findAll({
			where: { tenantName },
			include: [Appointment],
		})
	}

	async getByTenantName(tenantName: string) {
		return this.UserModel.findOne({ where: { tenantName } })
	}
	async getByUserName(userName: string, tenantName: string) {
		return this.UserModel.findOne({ where: { userName, tenantName } })
	}
	async getFree(tenantName: string): Promise<User[]> {
		return this.UserModel.findAll({ where: { CompanyId: null, tenantName } })
	}
	async addToCompany(userId: string, CompanyId: string) {
		return this.UserModel.update({ CompanyId }, { where: { id: userId } })
	}

	async removeFromCompany(userId: string) {
		return this.UserModel.update({ CompanyId: null }, { where: { id: userId } })
	}

	async getById(id: string): Promise<User> {
		return this.UserModel.findOne({
			where: { id },
			include: [Appointment],
		})
	}

	async getByCompany(CompanyId: string): Promise<User[]> {
		return this.UserModel.findAll({ where: { CompanyId } })
	}
	public async findBy({
		key,
		value,
	}: {
		key: keyof User
		value: string | number
	}): Promise<User> {
		return this.UserModel.findOne({
			where: { [key]: value },
		})
	}

	async create(data: Partial<User>): Promise<User> {
		return this.UserModel.create(data)
	}
	async update(id: string, data: Partial<User>) {
		return this.UserModel.update(data, { where: { id } })
	}
	async delete(id: string) {
		return this.UserModel.destroy({ where: { id: id } })
	}
}
