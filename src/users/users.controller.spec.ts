import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
   let controller: UsersController
   let mockUsersService: Partial<UsersService>
   let mockAuthService: Partial<AuthService>
   let users: User[]

   beforeEach(async () => {
      users = []
      mockUsersService = {
         findAll: (email?) => {
            if (!email) return Promise.resolve(users)

            return Promise.resolve(users.filter((u) => u.email === email))
         },
         findOne: (id: number) => {
            return Promise.resolve({
               id,
               name: 'Charles',
               email: 'charlie@chocolate.factory',
               password: 'Snozberry',
            })
         },
         create: (props) => {
            const { name, email, password } = props
            const user = {
               id: 222,
               name,
               email,
               password,
            }
            users.push(user)
            return Promise.resolve(user)
         },
         update: (id: number, attrs: Partial<User>) => {
            const before = {
               id,
               name: 'Charles',
               email: 'charlie@chocolate.factory',
               password: 'Snozberry',
            }
            return Promise.resolve({
               ...before,
               ...attrs,
            })
         },
         // remove: (id: number) => {
         //    return Promise.resolve({
         //       id,
         //       name: 'Charles',
         //       email: 'charlie@chocolate.factory',
         //    })
         // },
      }
      mockAuthService = {
         signup: (props) => {
            const { name, email, password } = props
            const result = {
               id: 1,
               name,
               email,
               password,
            }
            users.push(result)
            return Promise.resolve(result)
         },
         signin: (props) => {
            const { email, password } = props
            const result = {
               id: 1,
               name: 'Tarzan',
               email,
               password,
            }
            users.push(result)
            return Promise.resolve(result)
         },
      }
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UsersController],
         providers: [
            {
               provide: UsersService,
               useValue: mockUsersService,
            },
            {
               provide: AuthService,
               useValue: mockAuthService,
            },
         ],
      }).compile()

      controller = module.get(UsersController)
   })

   it('should be defined', () => {
      expect(controller).toBeDefined()
   })

   it('should find a list of users', async () => {
      await controller.signup(
         {
            name: 'Trey',
            email: 'charlie@chocolate.factory',
            password: 'eeee',
         },
         {}
      )
      console.log(users)
      const result = await controller.findAll('charlie@chocolate.factory')
      expect(result.length).toEqual(1)
   })

   it('should return a user', async () => {
      await controller.signup(
         {
            name: 'Trey',
            email: 'foo@boo.com',
            password: 'eeee',
         },
         {}
      )
      const user = await controller.findOne('1')
      expect(user).toBeDefined()
   })
})
