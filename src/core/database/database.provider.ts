import { Sequelize } from 'sequelize-typescript'
import { Company } from 'src/company/schema/company.model'
import { enviromentType } from '../constants'
import { databaseConfig } from './database.config'
import { User } from 'src/user/schema/user.model'
import { Appointment } from 'src/appointments/schema/appointment.model'
import { Service } from 'src/services/schema/service.model'
import { Customer } from 'src/customer/schema/customer.model'
import { Enterprise } from 'src/enterprise/schema/enterprise.model'
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
			sequelize.addModels([
				Enterprise,
				Company,
				User,
				Appointment,
				Service,
				Customer,
			])

			Enterprise.hasMany(Company)
			Company.belongsTo(Enterprise, {
				targetKey: 'id',
				foreignKey: 'EnterpriseId',
			})

			Enterprise.hasMany(User)
			User.belongsTo(Enterprise, {
				targetKey: 'id',
				foreignKey: 'EnterpriseId',
			})
			Enterprise.hasMany(Service)
			Service.belongsTo(Enterprise, {
				targetKey: 'id',
				foreignKey: 'EnterpriseId',
			})
			Company.hasMany(User)
			User.belongsTo(Company, { targetKey: 'id', foreignKey: 'CompanyId' })

			Customer.hasMany(Appointment)
			Appointment.belongsTo(Customer, {
				targetKey: 'id',
				foreignKey: 'CustomerId',
			})

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
