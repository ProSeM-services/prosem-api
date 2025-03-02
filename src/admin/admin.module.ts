import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { CompanyService } from 'src/company/company.service'
import { companyProviders } from 'src/company/company.providers'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [AdminController],
	providers: [UserService, CompanyService, ...userProvider, ...companyProviders],
})
export class AdminModule {}
