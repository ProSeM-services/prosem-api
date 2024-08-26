import { MiddlewareConsumer, Module } from '@nestjs/common'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { companyProviders } from './company.providers'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { AuthService } from 'src/auth/auth.service'
import { TenantsMiddleware } from 'src/core/middleware/tenants.middleware'
import { JwtService } from '@nestjs/jwt'
import { GeocodeService } from 'src/geocode/geocode.services'
@Module({
	controllers: [CompanyController],
	providers: [
		CompanyService,
		UserService,
		AuthService,
		JwtService,
		GeocodeService,
		...userProvider,
		...companyProviders,
	],
})
export class CompanyModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TenantsMiddleware).forRoutes(CompanyController)
	}
}
