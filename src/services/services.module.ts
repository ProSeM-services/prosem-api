import { Module } from '@nestjs/common'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { servicesProviders } from './services.providers'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { AuthModule } from 'src/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { userProvider } from 'src/user/user.provider'
import { CompanyService } from 'src/company/company.service'
import { companyProviders } from 'src/company/company.providers'

@Module({
	imports: [AuthModule],
	controllers: [ServicesController],
	providers: [
		ServicesService,
		AuthService,
		UserService,
		JwtService,
		CompanyService,
		...companyProviders,
		...servicesProviders,
		...userProvider,
	],
})
export class ServicesModule {}
