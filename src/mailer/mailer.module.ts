import { Module } from '@nestjs/common'
import { MailerController } from './mailer.controller'
import { MailerService } from './mailer.service'
import { MailerModule as MailerMainModule } from '@nestjs-modules/mailer'

@Module({
	imports: [
		MailerMainModule.forRoot({
			transport: {
				host: process.env.EMAIL_USERNAME,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
		}),
	],
	controllers: [MailerController],
	providers: [MailerService],
})
export class MailerModule {}
