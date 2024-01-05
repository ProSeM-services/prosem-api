import { Module } from '@nestjs/common'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { companyProviders } from './company.providers'

@Module({
	controllers: [CompanyController],
	providers: [CompanyService, ...companyProviders],
})
export class CompanyModule {}
