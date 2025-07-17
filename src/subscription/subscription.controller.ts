import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { CreateSubscriptionDTO } from './dto/subscription.dto'

@Controller('subscription')
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Get('/:enterpriseId')
	async getAll(@Param('enterpriseId') enterpriseId: string) {
		return await this.subscriptionService.getSubscriptionByEnterpriseId(
			enterpriseId
		)
	}

	@Post()
	async creat(@Body() body: CreateSubscriptionDTO) {
		try {
			return await this.subscriptionService.createSubscription(body)
		} catch (error) {
			throw error
		}
	}
}
