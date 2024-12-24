import { Injectable } from '@nestjs/common'
import { MailerService as MailerMainService } from '@nestjs-modules/mailer'
@Injectable()
export class MailerService {
	constructor(private mailerSerivice: MailerMainService) {}

	async sendEmail(email: string, data: { name: string; token: string }) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: 'Titulo del correo',
			template: './welcome',
			context: {
				name: data.name,
				year: 2024,
				confirmationLink: `${process.env.WEB_CLIENT_URL}/confirmation?token=${data.token}`,
			},
		})
	}
}
