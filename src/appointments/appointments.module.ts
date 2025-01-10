import { Module } from '@nestjs/common'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { companyProviders } from 'src/company/company.providers'
import { userProvider } from 'src/user/user.provider'
import { appointmentProvider } from './appointment.provider'
import { ServicesService } from 'src/services/services.service'
import { servicesProviders } from 'src/services/services.providers'
import { CustomerService } from 'src/customer/customer.service'
import { customerProvider } from 'src/customer/customer.provider'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from 'src/mailer/mailer.service'

@Module({
	controllers: [AppointmentsController],
	providers: [
		AppointmentsService,
		CompanyService,
		UserService,
		ServicesService,
		CustomerService,
		AuthService,
		JwtService,
		MailerService,
		...customerProvider,
		...companyProviders,
		...userProvider,
		...appointmentProvider,
		...servicesProviders,
	],
})
export class AppointmentsModule {}
