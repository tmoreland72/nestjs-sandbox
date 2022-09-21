import {
   BadRequestException,
   Injectable,
   NotFoundException,
} from '@nestjs/common'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { SignInAuthDto } from './dto/signin-auth.dto'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
   constructor(private usersService: UsersService) {}

   async signup(props: SignUpAuthDto) {
      const { name, email, password } = props
      const users = await this.usersService.findAll(email)
      if (users.length) throw new BadRequestException('email in use')

      const salt = randomBytes(8).toString('hex')
      const hash = (await scrypt(password, salt, 32)) as Buffer
      const hashed_password = `${salt}.${hash.toString('hex')}`
      console.log(`${password} become ${hashed_password}`)

      const user = await this.usersService.create({
         name,
         email,
         password: hashed_password,
      })

      return user
   }

   async signin(props: SignInAuthDto) {
      const { email, password } = props

      const users = await this.usersService.findAll(email)
      if (users.length === 0) throw new NotFoundException()

      const user = users[0]
      const stored_password = user.password
      const [salt, stored_hash] = stored_password.split('.')
      const hash = (await scrypt(password, salt, 32)) as Buffer
      if (hash.toString('hex') !== stored_hash)
         throw new BadRequestException('invalid credentials')

      return user
   }
}
