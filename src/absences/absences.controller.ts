import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Request,
	UnauthorizedException,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { AbsencesService } from './absences.service'
import { AbsenceDTO } from './dto/absence.dto'

@Controller('absences')
export class AbsencesController {
	constructor(
		private readonly absencesService: AbsencesService,
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	@Get()
	async getAll(@Request() req: ExpressRequest) {
		const requester = await this.authService.getDataFromToken(req)
		if (!requester.EnterpriseId) {
			throw new UnauthorizedException('Missing enterprise.')
		}
		return this.absencesService.getByEnterprise(requester.EnterpriseId)
	}

	@Post()
	async create(@Body() data: AbsenceDTO, @Request() req: ExpressRequest) {
		const requester = await this.authService.getDataFromToken(req)
		const user = await this.userService.getById(data.UserId)

		if (!user) {
			throw new UnauthorizedException('User not found.')
		}

		if (requester.EnterpriseId !== user.EnterpriseId) {
			throw new UnauthorizedException(
				'User does not belong to this enterprise.'
			)
		}

		const startDate = data.startDate.split('T')[0]
		const endDate = data.endDate.split('T')[0]

		const overlappingAbsence = await this.absencesService.findOverlapping(
			user.id,
			startDate,
			endDate
		)

		if (overlappingAbsence) {
			throw new UnauthorizedException(
				'User already has an absence for this range.'
			)
		}

		return this.absencesService.create({
			...data,
			startDate,
			endDate,
			tenantName: user.tenantName,
			EnterpriseId: user.EnterpriseId,
		})
	}

	@Get('/user/:id')
	async getByUser(@Param('id') id: string, @Request() req: ExpressRequest) {
		const requester = await this.authService.getDataFromToken(req)
		const user = await this.userService.getById(id)

		if (!user) {
			throw new UnauthorizedException('User not found.')
		}

		if (requester.EnterpriseId !== user.EnterpriseId) {
			throw new UnauthorizedException(
				'User does not belong to this enterprise.'
			)
		}

		return this.absencesService.getByUser(id)
	}

	@Delete(':id')
	async delete(@Param('id') id: string, @Request() req: ExpressRequest) {
		const requester = await this.authService.getDataFromToken(req)

		const absence = await this.absencesService.getById(id)
		if (!absence) {
			throw new UnauthorizedException('Absence not found.')
		}

		if (absence.EnterpriseId && requester.EnterpriseId !== absence.EnterpriseId) {
			throw new UnauthorizedException(
				'Absence does not belong to this enterprise.'
			)
		}

		await this.absencesService.delete(id)
		return { message: 'Absence removed successfully.' }
	}
}
