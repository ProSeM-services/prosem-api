import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
} from '@nestjs/common'
import { WorkhoursService } from './workhours.service'
import { WorkhourDto } from './dto/workhour.dto'
import { UserService } from 'src/user/user.service'
import { CompanyService } from 'src/company/company.service'

@Controller('workhours')
export class WorkhoursController {
	constructor(
		private readonly workhourService: WorkhoursService,
		private readonly userService: UserService,
		private readonly companyService: CompanyService
	) {}

	async checkOwner(data: WorkhourDto) {
		if ((data.userId && data.companyId) || (!data.userId && !data.companyId)) {
			throw new BadRequestException(
				'Debe especificar userId o companyId, pero no ambos.'
			)
		}
		if (data.userId) {
			const user = await this.userService.getById(data.userId)
			if (!user) {
				throw new NotFoundException('user not found')
			}
		} else if (data.companyId) {
			const company = await this.companyService.getById(data.companyId)
			if (!company) {
				throw new NotFoundException('company not found')
			}
		}
	}
	@Get()
	async getAll() {
		try {
			const allWorkHours = await this.workhourService.getAll()

			return allWorkHours
		} catch (error) {
			return error
		}
	}

	@Post()
	async create(@Body() data: WorkhourDto) {
		try {
			await this.checkOwner(data)
			await this.workhourService.create(data)
		} catch (error) {
			return error
		}
	}
}
