import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { userProvider } from './user.provider'
import { CompanyService } from 'src/company/company.service'
import { CompanyModule } from 'src/company/company.module'
import { companyProviders } from 'src/company/company.providers'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from 'src/mailer/mailer.service'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'

@Module({
	imports: [CompanyModule],
	controllers: [UserController],
	providers: [
		UserService,
		CompanyService,
		AuthService,
		JwtService,
		MailerService,
		EnterpriseService,
		...enterpriseProvider,
		...userProvider,
		...companyProviders,
	],
})
export class UserModule {}
