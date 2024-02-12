import { Module } from '@nestjs/common'
import { WorkhoursService } from './workhours.service'
import { WorkhoursController } from './workhours.controller'
import { workhourProvider } from './workhours.provider'
import { CompanyService } from 'src/company/company.service'
import { companyProviders } from 'src/company/company.providers'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [WorkhoursController],
	providers: [
		WorkhoursService,
		CompanyService,
		UserService,
		...workhourProvider,
		...companyProviders,
		...userProvider,
	],
})
export class WorkhoursModule {}
