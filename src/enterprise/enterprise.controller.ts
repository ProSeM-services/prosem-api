import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common'
import { EnterpriseService } from './enterprise.service'
import { CreateEnterpriseDto } from './dto/create-enterprise.dto'
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto'
import { GeocodeService } from 'src/geocode/geocode.services'
import { Location } from 'src/company/interfaces/location.interface'

@Controller('enterprise')
export class EnterpriseController {
	constructor(
		private readonly enterpriseService: EnterpriseService,
		private readonly geocodeService: GeocodeService
	) {}

	@Post()
	async create(@Body() data: CreateEnterpriseDto) {
		const { address } = data
		const locationData = await this.geocodeService.geocodeAddress(address)
		const formatedAddress: Location = {
			lat: locationData.lat,
			lng: locationData.lng,
			value: address,
			city: locationData.city,
		}
		return this.enterpriseService.create({
			...data,
			address: formatedAddress,
		})
	}

	@Get()
	findAll() {
		return this.enterpriseService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.enterpriseService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateEnterpriseDto: UpdateEnterpriseDto
	) {
		return this.enterpriseService.update(+id, updateEnterpriseDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.enterpriseService.remove(+id)
	}
}
