import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { CORS } from './core/constants'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors(CORS)
	app.setGlobalPrefix('/api')
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(3000)
	console.log('servidor corriendo en puerto 3000')
}
bootstrap()
