import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './core/database/database.module'
import { CompanyModule } from './company/company.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { ServicesModule } from './services/services.module'
import { CustomerModule } from './customer/customer.module';
import { StatsModule } from './stats/stats.module';
import { UploadModule } from './upload/upload.module';
import { MailerModule } from './mailer/mailer.module';
import * as dotenv from 'dotenv'
dotenv.config()
@Module({
	imports: [
		DatabaseModule,
		CompanyModule,
		UserModule,
		AuthModule,
		AppointmentsModule,
		ServicesModule,
		CustomerModule,
		StatsModule,
		UploadModule,
		MailerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
