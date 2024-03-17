import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { userProvider } from './user.provider'
import { CompanyService } from 'src/company/company.service'
import { CompanyModule } from 'src/company/company.module'
import { companyProviders } from 'src/company/company.providers'
import { WorkhoursService } from 'src/workhours/workhours.service'
import { workhourProvider } from 'src/workhours/workhours.provider'

@Module({
	imports: [CompanyModule],
	controllers: [UserController],
	providers: [
		UserService,
		CompanyService,
		WorkhoursService,
		...userProvider,
		...companyProviders,
		...workhourProvider,
	],
})
export class UserModule {}
