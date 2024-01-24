import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	db = process.env.NODE_ENV === 'development' ? 'LOCAL-DB' : 'WEB-DB'
	getHello(): string {
		return `ProSeM API | Working on:  enviroment ==> ${process.env.NODE_ENV} |   database ==>  ${this.db} `
	}
}
