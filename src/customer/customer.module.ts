import { Module } from '@nestjs/common'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { customerProvider } from './customer.provider'

@Module({
	controllers: [CustomerController],
	providers: [CustomerService, ...customerProvider],
})
export class CustomerModule {}
