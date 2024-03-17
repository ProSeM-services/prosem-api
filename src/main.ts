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
	console.log('server running on port 3000')
}
bootstrap()
