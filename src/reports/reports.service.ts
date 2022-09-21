import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { Report } from './report.entity'

@Injectable()
export class ReportsService {
   constructor(
      @InjectRepository(Report) private reportRepository: Repository<Report>
   ) {}

   create(props: CreateReportDto) {
      const payload = this.reportRepository.create(props)
      return this.reportRepository.save(payload)
   }

   findAll() {
      return this.reportRepository.find()
   }

   findOne(id: number) {
      return this.reportRepository.findOneBy({ id })
   }

   async update(id: number, attrs: UpdateReportDto) {
      const report = await this.findOne(id)
      if (!report) throw new NotFoundException()
      Object.assign(report, attrs)
      return this.reportRepository.save(report)
   }

   async remove(id: number) {
      const report = await this.findOne(id)
      if (!report) throw new NotFoundException()
      return this.reportRepository.remove(report)
   }
}
