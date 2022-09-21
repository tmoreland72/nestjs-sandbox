import { Expose } from 'class-transformer'

export class ReportDto {
   @Expose()
   id: number

   @Expose()
   price: number

   @Expose()
   make: string

   @Expose()
   model: string

   @Expose()
   year: number

   @Expose()
   lat: number

   @Expose()
   lng: number

   @Expose()
   mileage: number
}
