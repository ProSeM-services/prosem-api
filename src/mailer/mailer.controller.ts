import { Body, Controller, Post } from '@nestjs/common'
import { MailerService } from './mailer.service'

@Controller('mailer')
export class MailerController {
	constructor(private mailerService: MailerService) {}

	@Post()
	async sendEmail(@Body() body: { email: string; name: string }) {
		const { name, email } = body
		try {
			const data = {
				name,
				token: 'jkashdkjasakh1i239187',
			}
			await this.mailerService.sendEmail(email, data)
			return 'Mail enviado'
		} catch (error) {
			console.log(error)
			return 'Error al enviar mail'
		}
	}
}
