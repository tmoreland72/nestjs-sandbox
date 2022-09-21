import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsOptional } from 'class-validator'

export class UpdateUserDto {
   @ApiProperty()
   @IsOptional()
   @IsString()
   name: string

   @ApiProperty()
   @IsOptional()
   @IsEmail()
   email: string

   @ApiProperty()
   @IsOptional()
   @IsString()
   sensitive: string
}
