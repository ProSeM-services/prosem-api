import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'
import { TenantsMiddleware } from 'src/core/middleware/tenants.middleware'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { userProvider } from 'src/user/user.provider'
import { companyProviders } from 'src/company/company.providers'
import { AppointmentsService } from 'src/appointments/appointments.service'
import { appointmentProvider } from 'src/appointments/appointment.provider'
import { CustomerService } from 'src/customer/customer.service'
import { customerProvider } from 'src/customer/customer.provider'
import { ServicesService } from 'src/services/services.service'
import { servicesProviders } from 'src/services/services.providers'
import { AppointmentsModule } from 'src/appointments/appointments.module'

@Module({
	imports: [AppointmentsModule],
	controllers: [StatsController],
	providers: [
		StatsService,
		CompanyService,
		UserService,
		AuthService,
		AppointmentsService,
		ServicesService,
		CustomerService,
		JwtService,
		...servicesProviders,
		...userProvider,
		...companyProviders,
		...appointmentProvider,
		...customerProvider,
	],
})
export class StatsModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TenantsMiddleware).forRoutes(StatsController)
	}
}
