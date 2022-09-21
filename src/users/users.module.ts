import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor'

@Module({
   imports: [TypeOrmModule.forFeature([User])],
   controllers: [UsersController],
   providers: [
      AuthService,
      UsersService,
      {
         provide: APP_INTERCEPTOR,
         useClass: CurrentUserInterceptor,
      },
   ],
})
export class UsersModule {}
