import { UsersService } from '../users.service'
import {
   CallHandler,
   ExecutionContext,
   NestInterceptor,
   Injectable,
} from '@nestjs/common'

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
   constructor(private usersService: UsersService) {}

   async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest()
      const { userId } = request.session || {}
      console.log('userId', userId)
      if (userId) {
         const user = await this.usersService.findOne(userId)
         request.currentUser = user
      }
      return next.handle()
   }
}
