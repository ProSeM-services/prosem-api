import {  IsNotEmpty, IsOptional, IsString , IsEmail} from 'class-validator'

export class CompanyDTO{
    @IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	address: string

	@IsOptional()
	@IsString()
	image: string

}