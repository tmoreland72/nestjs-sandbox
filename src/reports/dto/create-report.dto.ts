import {
   IsDecimal,
   IsLatitude,
   IsLongitude,
   IsNumber,
   IsString,
   Max,
   Min,
} from 'class-validator'

export class CreateReportDto {
   @IsNumber()
   @Min(1)
   @Max(999999)
   price: number

   @IsString()
   make: string

   @IsString()
   model: string

   @IsNumber()
   @Min(1900)
   @Max(2050)
   year: number

   @IsLatitude()
   lat: number

   @IsLongitude()
   lng: number

   @IsNumber()
   @Min(0)
   @Max(999999)
   mileage: number
}
