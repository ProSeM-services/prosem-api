import { Module } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { userProvider } from 'src/user/user.provider'
import { AbsencesController } from './absences.controller'
import { absenceProvider } from './absence.provider'
import { AbsencesService } from './absences.service'
import { JwtService } from '@nestjs/jwt'

@Module({
	controllers: [AbsencesController],
	providers: [
		AbsencesService,
		AuthService,
		UserService,
		JwtService,
		...absenceProvider,
		...userProvider,
	],
	exports: [AbsencesService, ...absenceProvider],
})
export class AbsencesModule {}
