import { IDatabaseConfig } from './interfaces/dbConfig.interface'
import * as dotenv from 'dotenv'
dotenv.config()
export const databaseConfig: IDatabaseConfig = {
	development: process.env.DB_DEV_URL,
	test: process.env.DB_TEST_URL,
	production: process.env.DB_PROD_URL,
}
