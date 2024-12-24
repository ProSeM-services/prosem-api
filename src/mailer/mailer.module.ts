import { Module } from '@nestjs/common'
import { MailerController } from './mailer.controller'
import { MailerService } from './mailer.service'
import { MailerModule as MailerMainModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'
@Module({
	imports: [
		MailerMainModule.forRoot({
			transport: {
				host: process.env.EMAIL_HOST,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	controllers: [MailerController],
	providers: [MailerService],
})
export class MailerModule {}
