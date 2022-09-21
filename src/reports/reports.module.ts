import { Module } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Report } from './report.entity'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CurrentUserInterceptor } from '../users/interceptors/current-user.interceptor'

@Module({
   imports: [TypeOrmModule.forFeature([Report])],
   controllers: [ReportsController],
   providers: [
      ReportsService,
      // {
      //    provide: APP_INTERCEPTOR,
      //    useClass: CurrentUserInterceptor,
      // },
   ],
})
export class ReportsModule {}
