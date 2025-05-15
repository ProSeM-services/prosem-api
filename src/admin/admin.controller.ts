import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { MasterGuard } from 'src/auth/guards/master.guard'
import { CompanyService } from 'src/company/company.service'
import { User } from 'src/user/schema/user.model'
import { UserService } from 'src/user/user.service'

@Controller('admin')
@UseGuards(AuthGuard, MasterGuard)
export class AdminController {
	constructor(
		private readonly userService: UserService,
		private readonly companyService: CompanyService
	) {}

	@Get('accounts')
	async getAccounts() {
		try {
			return await this.userService.getAllOwners()
		} catch (error) {
			throw error
		}
	}
	@Get('users')
	async getUsers() {
		try {
			return await this.userService.getAll()
		} catch (error) {
			throw error
		}
	}
	@Patch('users/:userId')
	async updateUser(
		@Param('userId') userId: string,
		@Body() data: Partial<User>
	) {
		try {
			return await this.userService.update(userId, data)
		} catch (error) {
			throw error
		}
	}
	@Get('companies')
	async getCompanies() {
		try {
			return await this.companyService.getAll()
		} catch (error) {
			throw error
		}
	}
}
