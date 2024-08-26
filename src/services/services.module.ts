import { Module } from '@nestjs/common'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { servicesProviders } from './services.providers'

@Module({
	controllers: [ServicesController],
	providers: [ServicesService, ...servicesProviders],
})
export class ServicesModule {}
