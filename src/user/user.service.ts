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
		return this.UserModel.findByPk(id)
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
}
