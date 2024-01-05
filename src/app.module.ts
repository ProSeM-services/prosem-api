import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './core/database/database.module'
import { CompanyModule } from './company/company.module'
import * as dotenv from 'dotenv'
dotenv.config()
@Module({
	imports: [DatabaseModule, CompanyModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
