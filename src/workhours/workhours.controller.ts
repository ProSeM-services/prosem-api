import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	Patch,
	Param,
	Delete,
} from '@nestjs/common'
import { WorkhoursService } from './workhours.service'
import { WorkhourDto } from './dto/workhour.dto'
import { UserService } from 'src/user/user.service'
import { CompanyService } from 'src/company/company.service'
import { UpdateWorkHourDto } from './dto/update-workhour.dto'

@Controller('workhours')
export class WorkhoursController {
	constructor(
		private readonly workhourService: WorkhoursService,
		private readonly userService: UserService,
		private readonly companyService: CompanyService
	) {}

	async checkWorkHour(id: string) {
		try {
			const workHour = await this.workhourService.getById(id)
			if (!workHour) {
				throw new NotFoundException('workHour not found')
			}

			return workHour
		} catch (error) {
			return error
		}
	}
	async checkOwner(data: WorkhourDto) {
		if ((data.UserId && data.CompanyId) || (!data.UserId && !data.CompanyId)) {
			throw new BadRequestException(
				'You must specify userId or CompanyId, but not both.'
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

	@Get('/:id')
	async getOne(@Param() { id }: { id: string }) {
		try {
			return await this.checkWorkHour(id)
		} catch (error) {
			return error
		}
	}
	@Get('/user/:id')
	async getByUser(@Param() { id }: { id: string }) {
		try {
			const user = await this.userService.getById(id)
			if (!user) {
				throw new NotFoundException('user not found')
			}

			return this.workhourService.getByUserId(user.id)
		} catch (error) {
			return error
		}
	}

	@Patch('/:id')
	async update(
		@Body() data: UpdateWorkHourDto,
		@Param() { id }: { id: string }
	) {
		try {
			await this.checkWorkHour(id)

			await this.workhourService.update(data, id)

			return { message: 'WorkHour has benn updated succesfully!' }
		} catch (error) {
			return error
		}
	}
	@Delete('/:id')
	async delete(@Param() { id }: { id: string }) {
		try {
			await this.checkWorkHour(id)

			await this.workhourService.delete(id)

			return { message: 'WorkHour has benn deleted succesfully!' }
		} catch (error) {
			return error
		}
	}
}
