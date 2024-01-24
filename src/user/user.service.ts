import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/core/constants'
import { User } from './schema/user.model'
@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY) private readonly UserModel: typeof User
	) {}

	async getAll(): Promise<User[]> {
		return this.UserModel.findAll()
	}
	async getById(id: number): Promise<User> {
		return this.UserModel.findOne({ where: { id } })
	}
	async getByTenant(tenantId: string): Promise<User[]> {
		return this.UserModel.findAll({ where: { tenantId } })
	}
	public async findBy({
		key,
		value,
	}: {
		key: keyof User
		value: string | number
	}): Promise<User> {
		return this.UserModel.findOne({ where: { [key]: value } })
	}

	async create(data: Partial<User>): Promise<User> {
		return this.UserModel.create(data)
	}
	async update(id: number, data: Partial<User>) {
		return this.UserModel.update(data, { where: { id: id } })
	}
	async delete(id: number) {
		return this.UserModel.destroy({ where: { id: id } })
	}
}
