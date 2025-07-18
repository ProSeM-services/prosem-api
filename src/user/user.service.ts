import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/core/constants'
import { User } from './schema/user.model'
import { Appointment } from 'src/appointments/schema/appointment.model'
import { Op } from 'sequelize'
@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY) private readonly UserModel: typeof User
	) {}

	async getAllOwners(): Promise<User[]> {
		return this.UserModel.findAll({
			where: { role: 'OWNER' },
			include: [Appointment],
		})
	}
	async getAll(EnterpriseId?: string): Promise<User[]> {
		if (!EnterpriseId) return this.UserModel.findAll({ include: [Appointment] })
		return this.UserModel.findAll({
			where: { EnterpriseId },
			include: [Appointment],
		})
	}

	async getByTenantName(EnterpriseId: string) {
		return this.UserModel.findOne({ where: { EnterpriseId } })
	}
	async getByUserName(userName: string, tenantName: string) {
		return this.UserModel.findOne({ where: { userName, tenantName } })
	}
	async getFree(EnterpriseId: string): Promise<User[]> {
		return this.UserModel.findAll({ where: { CompanyId: null, EnterpriseId } })
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
	async searchUsers(value: string): Promise<User[]> {
		return await this.UserModel.findAll({
			where: {
				[Op.or]: [
					{ name: { [Op.iLike]: `%${value}%` } }, // Buscar en `name`
					{ lastName: { [Op.iLike]: `%${value}%` } }, // Buscar en `lastName`
				],
			},
		})
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
