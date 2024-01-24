import { IsNotEmpty, IsString } from 'class-validator'
import { IAuthBody } from '../interface/auth.interface'

export class LoginAuthDto implements IAuthBody {
	@IsNotEmpty()
	@IsString()
	user: string

	@IsNotEmpty()
	@IsString()
	password: string
}
