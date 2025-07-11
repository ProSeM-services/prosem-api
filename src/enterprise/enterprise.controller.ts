import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Request,
	UnauthorizedException,
} from '@nestjs/common'
import { EnterpriseService } from './enterprise.service'
import { CreateEnterpriseDto } from './dto/create-enterprise.dto'
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto'
import { GeocodeService } from 'src/geocode/geocode.services'
import { Location } from 'src/company/interfaces/location.interface'
import { AuthService } from 'src/auth/auth.service'
import { Request as ExpressRequest } from 'express'
import { UserService } from 'src/user/user.service'
import { NotificactionsService } from 'src/notificactions/notificactions.service'
import { Enterprise } from './schema/enterprise.model'
@Controller('enterprise')
export class EnterpriseController {
	constructor(
		private readonly enterpriseService: EnterpriseService,
		private readonly geocodeService: GeocodeService,
		private readonly authServices: AuthService,
		private readonly userServices: UserService,
		private readonly notificationService: NotificactionsService
	) {}

	@Post()
	async create(
		@Body() data: CreateEnterpriseDto,
		@Request() req: ExpressRequest
	) {
		const user = await this.authServices.getDataFromToken(req)

		if (!user.id) {
			throw new UnauthorizedException('Missing data in token')
		}
		const { address } = data
		const locationData = await this.geocodeService.geocodeAddress(address)
		const formatedAddress: Location = {
			lat: locationData.lat,
			lng: locationData.lng,
			value: address,
			city: locationData.city,
		}

		const newEnterpise = await this.enterpriseService.create({
			...data,
			address: formatedAddress,
			membership_price: data.membership_price ? data.membership_price : 0,
		})

		await this.userServices.update(user.id, {
			EnterpriseId: newEnterpise.id,
			account_type: 'BUSSINESS',
			role: 'OWNER',
			tenantName: data.name
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(''),
		})
		await this.notificationService.create({
			title: 'Nuevo negocio creado',
			message: `Se ha creado un nuevo negocio llamado ${data.name}`,
			relatedEntityId: newEnterpise.id,
			EnterpriseId: newEnterpise.id,
			type: 'system',
			read: false,
		})
		return newEnterpise
	}

	@Get()
	findAll() {
		return this.enterpriseService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.enterpriseService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateEnterpriseDto: Partial<Enterprise>
	) {
		return this.enterpriseService.update(id, updateEnterpriseDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.enterpriseService.remove(id)
	}
}
