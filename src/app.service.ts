import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getHello(): string {
		return `Hello World! WORKING ON ${process.env.NODE_ENV} ENVIROMENT`
	}
}
