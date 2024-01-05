import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	async checkUserExist(id: number) {
		const companyToUpdate = await this.userService.getById(id)
		if (!companyToUpdate) {
			throw new NotFoundException('User not found!')
		}
	}
	@Get()
	async getAll() {
		try {
			return this.userService.getAll()
		} catch (error) {
			return error
		}
	}
	@Get(':id')
	async getOne(@Param() { id }: { id: number }) {
		try {
			await this.checkUserExist(id)
			return this.userService.getById(id)
		} catch (error) {
			return error
		}
	}
}
