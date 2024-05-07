import { z } from 'zod'

const envZodModel = z.object({
	DB_DEV_URL: z.string().url(),
	DB_TEST_URL: z.string().url(),
	DB_PROD_URL: z.string().url(),
	JWTKEY: z.string(),
	TOKEN_EXPIRATION: z.string(),
	BEARER: z.string(),
	PORT: z.string(),
	HASH_SALT: z.string(),
	NODE_ENV: z.string().optional(),
})

envZodModel.parse(process.env)

type EnvType = z.infer<typeof envZodModel>
declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvType {}
	}
}
