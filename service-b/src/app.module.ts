import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportModule } from "./report/report.module";
import { Report } from "./report/report.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres_user',
      password: 'postgres_password',
      database: 'report_service',
      entities: [Report],
      synchronize: true,
      logging: true,
    }),
    ReportModule,
  ],
})
export class AppModule {}
