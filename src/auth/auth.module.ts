import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { CompanyService } from 'src/company/company.service'
import { companyProviders } from 'src/company/company.providers'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from 'src/mailer/mailer.service'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		CompanyService,
		UserService,
		JwtService,
		MailerService,
		EnterpriseService,
		...enterpriseProvider,
		...userProvider,
		...companyProviders,
	],
})
export class AuthModule {}
