import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ThreatLevel } from '../dto/url-analysis-result.dto';

@Entity('url_scans')
export class UrlScan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  @Index()
  url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  domain!: string;
  @Column({
    type: 'enum',
    enum: ThreatLevel,
    default: ThreatLevel.UNKNOWN,
  })
  @Index()
  threatLevel!: ThreatLevel;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'float', default: 0 })
  confidence!: number;

  @Column({ type: 'jsonb', nullable: true })
  reasons!: string[];

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ type: 'int', default: 0 })
  analysisTime!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  feature!: string;

  @Column({ type: 'text', nullable: true })
  pageUrl!: string;

  @Column({ type: 'text', nullable: true })
  userAgent!: string;

  @Column({ type: 'inet', nullable: true })
  ipAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
