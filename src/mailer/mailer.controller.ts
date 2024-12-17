import { Controller, Post } from '@nestjs/common'
import { MailerService } from './mailer.service'

@Controller('mailer')
export class MailerController {
	constructor(private mailerService: MailerService) {}

	@Post()
	async sendEmail() {
		const email = 'fvillanueva.dev@gmail.com'
		try {
			await this.mailerService.sendEmail(email)
			return 'Mail enviado'
		} catch (error) {
			console.log(error)
			return 'Error al enviar mail'
		}
	}
}
