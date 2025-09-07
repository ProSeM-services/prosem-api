import { z } from 'zod'

const envZodModel = z.object({
	DB_URL: z.string().url(),
	JWTKEY: z.string(),
	TOKEN_EXPIRATION: z.string(),
	BEARER: z.string(),
	PORT: z.string(),
	HASH_SALT: z.string(),
	GOOGLE_MAPS_APIKEY: z.string(),
	EMAIL_HOST: z.string(),
	EMAIL_USERNAME: z.string(),
	EMAIL_PASSWORD: z.string(),
	AWS_S3_REGION: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_BUCKET: z.string(),
	WEB_CLIENT_URL: z.string().url(),
	WEB_BACKOFFICE_URL: z.string().url(),
	NODE_ENV: z.string().optional(),
	MP_ACCESS_TOKEN: z.string(),
})

envZodModel.parse(process.env)

type EnvType = z.infer<typeof envZodModel>
declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvType {}
	}
}
