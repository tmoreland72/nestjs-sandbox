import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as session from 'express-session'
import { UsersModule } from './users/users.module'
import { CoursesModule } from './courses/courses.module'
import { User } from './users/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ReportsModule } from './reports/reports.module'

const ENV = process.env.NODE_ENV

@Module({
   imports: [
      CoursesModule,
      UsersModule,
      ReportsModule,
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: `.env.${process.env.NODE_ENV}`,
      }),
      TypeOrmModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => {
            return {
               type: 'better-sqlite3',
               database:
                  ENV === 'test' ? ':memory:' : config.get<string>('DB_NAME'),
               entities: [User],
               dropSchema: ENV === 'test' ? true : false,
               synchronize: true,
               migrations: ['build/src/db/migrations/*.js'],
               migrationsTableName: '__typeorm_migration',
            }
         },
      }),
   ],
   providers: [
      {
         provide: APP_PIPE,
         useValue: new ValidationPipe({ whitelist: true }),
      },
   ],
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
         .apply(
            session({
               secret: 'asdas;o93n;as9dfnasdkqf;liht',
               resave: false,
               saveUninitialized: false,
            })
         )
         .forRoutes('*')
   }
}
