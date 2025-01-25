import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppointmentDTO } from './dto/appointment.dto'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000', 'http://localhost:5173'], // Dominios permitidos (Backoffice y Client Page)
	},
})
export class AppointmentsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server
	constructor(private readonly authService: AuthService) {}

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.headers.authorization?.split(' ')[1]
			if (!token) {
				throw new UnauthorizedException('Token not provided')
			}

			const tenantName = await this.authService.getTenantFromToken(token)

			if (!tenantName) {
				throw new UnauthorizedException('Tenant not found in token')
			}

			// Unir al cliente al room correspondiente
			client.join(tenantName)
			console.log(`Cliente conectado al tenant: ${tenantName}`)
		} catch (error) {
			throw error
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Cliente desconectado: ${client.id}`)
	}

	notifyNewTurno(turno: AppointmentDTO, tenantName: string) {
		this.server.to(tenantName).emit('nuevo-turno', turno)
	}
}
