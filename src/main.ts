import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { CORS } from './core/constants'
import './core/config/env.config'
import { ZodValidationPipe } from '@anatine/zod-nestjs'
async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors(CORS)
	app.setGlobalPrefix('/api')
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: false,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		})
	)
	app.useGlobalPipes(new ZodValidationPipe())
	await app.listen(process.env.PORT)
	console.log(
		`ProSeM | Server Running at ${process.env.PORT} \n Enviroment ===>  ${process.env.NODE_ENV}`
	)
}
bootstrap()
