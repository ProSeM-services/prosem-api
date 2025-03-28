import { Module } from '@nestjs/common'
import { EnterpriseService } from './enterprise.service'
import { EnterpriseController } from './enterprise.controller'
import { enterpriseProvider } from './enterprise.provider'
import { GeocodeService } from 'src/geocode/geocode.services'

@Module({
	controllers: [EnterpriseController],
	providers: [EnterpriseService, GeocodeService, ...enterpriseProvider],
})
export class EnterpriseModule {}
