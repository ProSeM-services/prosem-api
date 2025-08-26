import { Injectable } from '@nestjs/common'
import { MailerService as MailerMainService } from '@nestjs-modules/mailer'
import { join } from 'path'
@Injectable()
export class MailerService {
	constructor(private mailerSerivice: MailerMainService) {}

	private attachments = [
		{
			filename: 'logo.png',
			path: join(process.cwd(), 'assets', 'logo.png'), // ruta dentro del proyecto
			cid: 'logo', // 👈 este ID lo usás en el .hbs
		},
	]
	async sendEmail(email: string, data: { name: string; token: string }) {
		//THIS IS FOR EMAIL CONFIRAMTION
		await this.mailerSerivice.sendMail({
			to: email,
			subject: 'Bienvenido a ReservePro',
			template: './welcome',
			context: {
				name: data.name,
				year: 2024,
				confirmationLink: `${process.env.WEB_BACKOFFICE_URL}/confirmation?token=${data.token}`,
			},
			attachments: this.attachments,
		})
	}

	async sendInvite(
		email: string,
		data: { name: string; token: string; companyName: string }
	) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: `Únete a ${data.companyName}`,
			template: './invite',
			context: {
				name: data.name,
				companyName: data.companyName,
				year: 2024,
				confirmationLink: `${process.env.WEB_BACKOFFICE_URL}/confimrInvitaion?token=${data.token}`,
			},
			attachments: this.attachments,
		})
	}
	async sendAppointmentdata(
		email: string,
		data: {
			name: string
			userName: string
			time: string
			day: string
			serviceProvision: string
			service: string
			cancelationToken: string
		}
	) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: `Agendaste un turno en ReservePro`,
			template: './appointment-data',
			context: {
				...data,
				year: 2024,
				cancelationLink: `${process.env.WEB_CLIENT_URL}/cancel-appointment?token=${data.cancelationToken}`,
			},
			attachments: this.attachments,
		})
	}
	async sendCancelationOK(
		email: string,
		data: {
			name: string
			userName: string
			time: string
			day: string
			serviceProvision: string
			service: string
		}
	) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: `Cancelación de turno`,
			template: './appointment-cancel',
			context: {
				...data,
			},
			attachments: this.attachments,
		})
	}
	async sendReactivationOK(
		email: string,
		data: {
			name: string
			userName: string
			time: string
			day: string
			serviceProvision: string
			service: string
			cancelationToken: string
		}
	) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: `Reactivación de turno`,
			template: './appointment-reactive',
			context: {
				...data,
				cancelationLink: `${process.env.WEB_CLIENT_URL}/cancel-appointment?token=${data.cancelationToken}`,
			},
			attachments: this.attachments,
		})
	}

	async sendResetPassword(email: string, data: { name: string; token: string }) {
		await this.mailerSerivice.sendMail({
			to: email,
			subject: 'Reseteo de contraseña',
			template: './reset-password',
			context: {
				name: data.name,
				year: 2025,
				resetLink: `${process.env.WEB_BACKOFFICE_URL}/reset-password?token=${data.token}`,
			},
			attachments: this.attachments,
		})
	}
}
