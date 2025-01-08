import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppointmentDTO } from './dto/appointment.dto'

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000', 'http://localhost:5173'], // Dominios permitidos (Backoffice y Client Page)
	},
})
export class AppointmentsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server

	handleConnection(client: Socket) {
		console.log(`Cliente conectado: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		console.log(`Cliente desconectado: ${client.id}`)
	}

	notifyNewTurno(turno: AppointmentDTO) {
		this.server.emit('nuevo-turno', turno) // Envía notificación a todos los clientes
	}
}
