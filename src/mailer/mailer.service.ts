import { Injectable } from '@nestjs/common'
import { MailerService as MailerMainService } from '@nestjs-modules/mailer'
import { IAppointment } from 'src/appointments/schema/appointment.zod'
@Injectable()
export class MailerService {
	constructor(private mailerSerivice: MailerMainService) {}

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
		})
	}
}
