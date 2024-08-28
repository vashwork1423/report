import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report } from "./report.entity";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as ExcelJS from "exceljs";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async createReport(serviceName: string, dataEndpoint: string, headers: string[]): Promise<Report> {
    const report = this.reportRepository.create({ serviceName, dataEndpoint, headers });
    await this.reportRepository.save(report);

    // Start generation process
    this.generateExcelReport(report.id, serviceName, dataEndpoint, headers);

    return report;
  }

  async generateExcelReport(reportId: number, serviceName: string, dataEndpoint: string, headers: string[]) {
    const report = await this.reportRepository.findOneBy({ id: reportId });

    try {
      const response = await axios.get(`${dataEndpoint}`);
      const data = response.data;
      console.log(data)

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      worksheet.addRow(headers);

      data.forEach((item: any) => {
        const row = headers.map(header => item[header.toLowerCase()]);
        worksheet.addRow(row);
      });

      const filePath = path.join(__dirname, `../../reports/report-${reportId}.xlsx`);
      await workbook.xlsx.writeFile(filePath);

      report.status = "completed";
      report.fileUrl = `http://localhost:3001/reports/download/report-${reportId}.xlsx`;;
      await this.reportRepository.save(report);
    } catch (error) {
      report.status = "failed";
      await this.reportRepository.save(report);
    }
  }

  async getReportStatus(id: number): Promise<Report> {
    return this.reportRepository.findOneBy({ id: id});
  }
}
