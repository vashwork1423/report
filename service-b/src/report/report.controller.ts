import { Controller, Post, Get, Body, Param, Res, HttpStatus  } from "@nestjs/common";
import { ReportService } from "./report.service";
import * as path from 'path';
import * as fs from 'fs';

@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(
    @Body("serviceName") serviceName: string,
    @Body("dataEndpoint") dataEndpoint: string,
    @Body("headers") headers: string[],
  ) {
    const report = await this.reportService.createReport(serviceName, dataEndpoint, headers);
    return { id: report.id };
  }

  @Get(":id")
  async getReportStatus(@Param("id") id: number) {
    const report = await this.reportService.getReportStatus(id);
    return {
      status: report.status,
      fileUrl: report.status === "completed" ? report.fileUrl : null,
    };
  }

  @Get('download/:fileName')
  async downloadReport(@Param('fileName') fileName: string, @Res() res: Response) {
    console.log('sadasd', __dirname, `../../reports/${fileName}`)
    const filePath = path.join(__dirname, `../../reports/${fileName}`);
console.log(filePath)
    if (fs.existsSync(filePath)) {
        (res as any).sendFile(filePath);
      } else {
        (res as any).status(HttpStatus.NOT_FOUND).send('File not found');
      }
  }
}
