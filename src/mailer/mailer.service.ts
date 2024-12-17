import { Injectable } from '@nestjs/common'
import { MailerService as MailerMainService } from '@nestjs-modules/mailer'
@Injectable()
export class MailerService {
	constructor(private mailerSerivice: MailerMainService) {}

	async sendEmail(email: string) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: 'Titulo del correo',
			html: 'Hola',
		})
	}
}
