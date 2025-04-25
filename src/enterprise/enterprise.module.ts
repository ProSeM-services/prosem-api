import { Module } from '@nestjs/common'
import { EnterpriseService } from './enterprise.service'
import { EnterpriseController } from './enterprise.controller'
import { enterpriseProvider } from './enterprise.provider'
import { GeocodeService } from 'src/geocode/geocode.services'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { userProvider } from 'src/user/user.provider'

@Module({
	controllers: [EnterpriseController],
	providers: [
		EnterpriseService,
		GeocodeService,
		AuthService,
		UserService,
		JwtService,
		...enterpriseProvider,
		...userProvider,
	],
})
export class EnterpriseModule {}
