NodeJS.ProcessEnv

declare namespace NodeJS {
	interface IProcessEnv {
		DB_HOST: string
		DB_PORT: string
		DB_USER: string
		DB_PASS: string
		DB_DIALECT: string
		DB_NAME_TEST: string
		DB_NAME_DEVELOPMENT: string
		DB_NAME_PRODUCTION: string
		JWTKEY: string
		TOKEN_EXPIRATION: string
		BEARER: string
		PORT: number
		NODE_ENV: string
	}
}
