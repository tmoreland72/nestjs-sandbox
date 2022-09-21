import { Expose, Exclude } from 'class-transformer'

export class UserDto {
   @Expose()
   id: number

   @Expose()
   email: string

   @Expose()
   name: string

   @Exclude()
   sensitive: string
}
