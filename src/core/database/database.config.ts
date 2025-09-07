import { IDatabaseConfig } from './interfaces/dbConfig.interface'
import * as dotenv from 'dotenv'
dotenv.config()
export const databaseConfig: IDatabaseConfig = {
	development: process.env.DB_URL,
	test: process.env.DB_URL,
	production: process.env.DB_URL,
}
