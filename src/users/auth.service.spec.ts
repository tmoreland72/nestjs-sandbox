import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => {
   let service: AuthService
   let mockUsersService: Partial<UsersService>

   beforeEach(async () => {
      const users: User[] = []

      mockUsersService = {
         findAll: (email: string) => {
            const filtered = users.filter((u) => u.email === email)
            return Promise.resolve(filtered)
         },
         create: ({ name, email, password }) => {
            const user = { id: new Date().valueOf(), name, email, password }
            users.push(user)
            return Promise.resolve(user)
         },
      }
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            {
               provide: UsersService,
               useValue: mockUsersService,
            },
         ],
      }).compile()

      service = module.get(AuthService)
   })

   it('should create an instance of AuthService', () => {
      expect(service).toBeDefined()
   })

   it('should create a new user on signup', async () => {
      const injected = {
         name: 'NameFoo',
         email: 'name@foo.bar',
         password: 'Password1',
      }
      const expected = {
         name: 'NameFoo',
         email: 'name@foo.bar',
      }

      const result = await service.signup(injected)
      expect(result).toMatchObject(expected)
      expect(result.password).not.toEqual(injected.password)
      const [salt, hash] = result.password.split('.')
      expect(salt).toBeDefined()
      expect(hash).toBeDefined()
      expect(result).toHaveProperty('id')
   })

   it('throws BadRequestException on signup when email in use', async () => {
      const injected = {
         name: 'NameFoo',
         email: 'name@foo.bar',
         password: 'Password1',
      }
      await service.signup(injected)

      await expect(service.signup(injected)).rejects.toThrow(
         BadRequestException
      )
   })

   it('throws NotFoundException when email is missing', async () => {
      const injected = {
         email: 'nada@foo.bar',
         password: 'Password1',
      }
      await expect(service.signin(injected)).rejects.toThrow(NotFoundException)
   })

   it('throws BadRequestException for invalid password', async () => {
      const injected = {
         email: 'name@foo.bar',
         password: 'Password1',
      }

      await service.signup({
         name: 'Phil',
         email: 'name@foo.bar',
         password: 'h!4f9',
      })

      await expect(service.signin(injected)).rejects.toThrow(
         BadRequestException
      )
   })

   it('signs in user', async () => {
      const injected = {
         email: 'name@foo.bar',
         password: 'Password1',
      }

      await service.signup({ ...injected, name: 'John' })

      const result = await service.signin(injected)
      expect(result).toMatchObject({ email: 'name@foo.bar' })
   })
})
