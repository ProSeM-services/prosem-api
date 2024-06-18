import { Module } from '@nestjs/common'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { companyProviders } from './company.providers'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { AuthService } from 'src/auth/auth.service'
@Module({
	controllers: [CompanyController],
	providers: [
		CompanyService,
		UserService,
		AuthService,
		...userProvider,
		...companyProviders,
	],
})
export class CompanyModule {}
