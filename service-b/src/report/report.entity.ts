import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  dataEndpoint: string;

  @Column("simple-array")
  headers: string[];

  @Column({ default: "pending" })
  status: string;

  @Column({ nullable: true })
  fileUrl: string;
}
