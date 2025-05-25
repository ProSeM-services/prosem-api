import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { CompanyService } from 'src/company/company.service'
import { companyProviders } from 'src/company/company.providers'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { EnterpriseService } from 'src/enterprise/enterprise.service'
import { enterpriseProvider } from 'src/enterprise/enterprise.provider'
import { PaymentsService } from 'src/payments/payments.service'
import { paymentProvider } from 'src/payments/payment.provider'

@Module({
	controllers: [AdminController],
	providers: [
		UserService,
		CompanyService,
		AuthService,
		JwtService,
		EnterpriseService,
		CompanyService,
		PaymentsService,
		...paymentProvider,
		...companyProviders,
		...enterpriseProvider,
		...userProvider,
		...companyProviders,
	],
})
export class AdminModule {}
