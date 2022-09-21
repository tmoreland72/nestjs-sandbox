import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class SignInAuthDto {
   @ApiProperty()
   @IsEmail()
   email: string

   @ApiProperty()
   @IsString()
   password: string
}
