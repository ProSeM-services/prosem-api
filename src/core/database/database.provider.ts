import { Sequelize } from 'sequelize-typescript'
import { Company } from 'src/company/schema/company.model'
import { enviromentType } from '../constants'
import { databaseConfig } from './database.config'
import { User } from 'src/user/schema/user.model'
import { Appointment } from 'src/appointments/schema/appointment.model'
import { Service } from 'src/services/schema/service.model'
export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			let config: string
			switch (process.env.NODE_ENV as enviromentType) {
				case 'development':
					config = databaseConfig.development
					break
				case 'test':
					config = databaseConfig.test
					break
				case 'production':
					config = databaseConfig.production
					break
				default:
					config = databaseConfig.development
			}
			const sequelize = new Sequelize(config, {
				dialect: 'postgres',
				logging: false,
			})
			sequelize.addModels([Company, User, Appointment, Service])

			Company.hasMany(User)
			User.belongsTo(Company, { targetKey: 'id', foreignKey: 'CompanyId' })

			Company.belongsToMany(Service, { through: 'CompanyService' })
			Service.belongsToMany(Company, { through: 'CompanyService' })

			User.belongsToMany(Service, { through: 'UserService' })
			Service.belongsToMany(User, { through: 'UserService' })

			User.hasMany(Appointment)
			Appointment.belongsTo(User, { targetKey: 'id', foreignKey: 'UserId' })

			Service.hasMany(Appointment)
			Appointment.belongsTo(Service, { targetKey: 'id', foreignKey: 'ServiceId' })

			await sequelize.sync({ alter: true })
			return sequelize
		},
	},
]
