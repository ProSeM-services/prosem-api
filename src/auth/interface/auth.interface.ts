export interface IPayloadToken {
	id: string
	name: string
	email: string
	lastName: string
	role: string
	userName: string
	image: string
	tenantId: string
}

export interface IAuthBody {
	user: string
	password: string
}

export interface IAuthResponse {
	accessToken: string
	user: IPayloadToken
}

export interface IUseToken {
	role: string
	sub: string
	isExpired: boolean
}
