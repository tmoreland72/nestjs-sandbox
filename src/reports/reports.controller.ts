import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   UseGuards,
} from '@nestjs/common'
import { ReportsService } from './reports.service'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { AuthGuard } from '../guards/auth.guard'
import { Serialize } from '../interceptors/serialize.interceptor'
import { ReportDto } from './dto/report.dto'
import { Report } from './report.entity'

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
   constructor(private readonly reportsService: ReportsService) {}

   @Post()
   @UseGuards(AuthGuard)
   create(@Body() body: CreateReportDto): Promise<Report> {
      return this.reportsService.create(body)
   }

   @Get()
   findAll() {
      return this.reportsService.findAll()
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.reportsService.findOne(+id)
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
      return this.reportsService.update(+id, updateReportDto)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.reportsService.remove(+id)
   }
}
