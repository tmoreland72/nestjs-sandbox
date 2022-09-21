import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.entity'

@Injectable()
export class UsersService {
   constructor(
      @InjectRepository(User) private userRepository: Repository<User>
   ) {}

   findAll(email?: string): Promise<User[]> {
      if (email) {
         return this.userRepository.find({ where: { email } })
      }
      return this.userRepository.find()
   }

   findOne(id: number): Promise<User> {
      console.log('findOne', id)
      if (!id) return null

      const user = this.userRepository.findOneBy({ id })
      if (!user) throw new NotFoundException()
      return user
   }

   create(props: CreateUserDto): Promise<User> {
      const payload = this.userRepository.create(props)
      return this.userRepository.save(payload)
   }

   async update(id: number, attrs: UpdateUserDto): Promise<User> {
      const user = await this.findOne(id)
      if (!user) throw new NotFoundException()
      Object.assign(user, attrs)
      return this.userRepository.save(user)
   }

   async remove(id: number): Promise<User> {
      const user = await this.findOne(id)
      if (!user) throw new NotFoundException()
      return this.userRepository.remove(user)
   }
}
