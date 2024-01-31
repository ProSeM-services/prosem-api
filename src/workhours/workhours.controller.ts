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
		if ((data.UserId && data.CompanyId) || (!data.UserId && !data.CompanyId)) {
			throw new BadRequestException(
				'Debe especificar userId o CompanyId, pero no ambos.'
			)
		}
		if (data.UserId) {
			const user = await this.userService.getById(data.UserId)
			if (!user) {
				throw new NotFoundException('user not found')
			}
		} else if (data.CompanyId) {
			const company = await this.companyService.getById(data.CompanyId)
			if (!company) {
				throw new NotFoundException('company not found')
			}
		}

		const isDayExists = await this.workhourService.getByDay(data)
		if (isDayExists) {
			throw new NotFoundException('these day is already created')
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
			return await this.workhourService.create(data)
		} catch (error) {
			return error
		}
	}
}
