import { Module } from '@nestjs/common'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'
import { CompanyService } from 'src/company/company.service'
import { UserService } from 'src/user/user.service'
import { companyProviders } from 'src/company/company.providers'
import { userProvider } from 'src/user/user.provider'
import { appointmentProvider } from './appointment.provider'
import { WorkhoursService } from 'src/workhours/workhours.service'
import { workhourProvider } from 'src/workhours/workhours.provider'

@Module({
	controllers: [AppointmentsController],
	providers: [
		AppointmentsService,
		CompanyService,
		UserService,
		WorkhoursService,
		...companyProviders,
		...userProvider,
		...appointmentProvider,
		...workhourProvider,
	],
})
export class AppointmentsModule {}
