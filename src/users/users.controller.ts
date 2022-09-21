import {
   Body,
   Controller,
   Delete,
   Get,
   NotFoundException,
   Param,
   Patch,
   Post,
   Query,
   Session,
   UseGuards,
} from '@nestjs/common'
import {
   ApiBadRequestResponse,
   ApiCreatedResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiQuery,
   ApiTags,
} from '@nestjs/swagger'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { SignInAuthDto } from './dto/signin-auth.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { CurrentUser } from './decorators/current-user.decorator'
import { AuthGuard } from '../guards/auth.guard'

@ApiTags('users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
   constructor(
      private readonly usersService: UsersService,
      private readonly authService: AuthService
   ) {}

   @ApiOkResponse({ type: User, isArray: true })
   // @ApiQuery({ email: 'email', required: false })
   @Get()
   findAll(@Query('email') email: string): Promise<User[]> {
      return this.usersService.findAll(email)
   }

   @ApiOkResponse({ type: User, isArray: false })
   @ApiNotFoundResponse()
   @Get(':id')
   async findOne(@Param('id') id: string): Promise<User> {
      const user = await this.usersService.findOne(parseInt(id))
      if (!user) {
         throw new NotFoundException()
      }
      return user
   }

   @Get('/whoami')
   @UseGuards(AuthGuard)
   whoami(@CurrentUser() user: User) {
      return user
   }

   @ApiCreatedResponse({ type: User })
   @ApiBadRequestResponse()
   @Post('/signup')
   async signup(
      @Body() body: SignUpAuthDto,
      @Session() session: Record<string, any>
   ): Promise<User> {
      const user = await this.authService.signup(body)
      session.userId = user.id
      return user
   }

   @ApiOkResponse({ type: User })
   @ApiBadRequestResponse()
   @Post('/signin')
   async signin(
      @Body() body: SignInAuthDto,
      @Session() session: Record<string, any>
   ): Promise<User> {
      const user = await this.authService.signin(body)
      session.userId = user.id
      return user
   }

   @ApiOkResponse({ type: User })
   @ApiBadRequestResponse()
   @Post('/signout')
   async signout(@Session() session: any) {
      delete session.userId
   }

   @ApiOkResponse({ type: User })
   @ApiBadRequestResponse()
   @Patch(':id')
   update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
      return this.usersService.update(parseInt(id), body)
   }

   @ApiOkResponse({ type: User })
   @ApiBadRequestResponse()
   @Delete(':id')
   remove(@Param('id') id: string): Promise<User> {
      return this.usersService.remove(parseInt(id))
   }
}
