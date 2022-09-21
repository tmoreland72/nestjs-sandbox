import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Auth System', () => {
   let app: INestApplication

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
      await app.init()
   })

   it('handle a signup request', () => {
      return request(app.getHttpServer())
         .post('/users/signup')
         .send({
            name: 'Tim',
            email: 'goof@email.com',
            password: 'Password1',
         })
         .expect(201)
         .then((res) => {
            const { id, email } = res.body
            expect(id).toBeDefined()
            expect(email).toEqual('goof@email.com')
         })
   })

   it('handle a signup request', () => {
      return request(app.getHttpServer())
         .post('/users/signup')
         .send({
            name: 'Tim',
            email: 'goof@email.com',
            password: 'Password1',
         })
         .expect(201)
         .then((res) => {
            const { id, email } = res.body
            expect(id).toBeDefined()
            expect(email).toEqual('goof@email.com')
         })
   })
})
