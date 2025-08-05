import { Inject, Injectable } from '@nestjs/common'
import { SUBSCRIPTION_REPOSITORY } from 'src/core/constants'
import { Subscription } from './schema/subscription.model'
import { Op } from 'sequelize'
import { CreateSubscriptionDTO } from './dto/subscription.dto'

@Injectable()
export class SubscriptionService {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY)
		private readonly SubscriptionModel: typeof Subscription
	) {}

	// Crear una nueva suscripción
	async createSubscription(data: CreateSubscriptionDTO) {
		return this.SubscriptionModel.create({
			...data,
			status: 'active',
		})
	}

	// Obtener suscripción activa de un negocio
	async getSubscriptionByEnterpriseId(enterpriseId: string) {
		return this.SubscriptionModel.findOne({
			where: {
				EnterpriseId: enterpriseId,
				status: 'active',
			},
		})
	}

	// Actualizar una suscripción existente (por ID)
	async updateSubscription(id: string, updates: Partial<Subscription>) {
		const subscription = await this.SubscriptionModel.findByPk(id)
		if (!subscription) return null

		return subscription.update(updates)
	}

	// Verificar si una empresa tiene una suscripción activa
	async isSubscriptionActive(enterpriseId: string): Promise<boolean> {
		const subscription = await this.getSubscriptionByEnterpriseId(enterpriseId)

		if (!subscription) return false

		const now = new Date()
		const end = new Date(subscription.endDate)

		return subscription.status === 'active' && end >= now
	}

	// Marcar como vencidas las suscripciones cuyo endDate ya pasó
	async expireSubscriptions(): Promise<number> {
		const [affectedCount] = await this.SubscriptionModel.update(
			{ status: 'expired' },
			{
				where: {
					endDate: {
						[Op.lt]: new Date().toISOString(),
					},
					status: 'active',
				},
			}
		)

		return affectedCount // cantidad de suscripciones marcadas como vencidas
	}
}
