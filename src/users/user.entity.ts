import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity()
export class User {
   @ApiProperty()
   @PrimaryGeneratedColumn()
   id: number

   @ApiProperty()
   @Column()
   name: string

   @ApiProperty()
   @Column()
   email: string

   @ApiProperty()
   @Exclude()
   @Column()
   password: string
}
