import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('progress_tracking')
export class ProgressTracking {
  @PrimaryGeneratedColumn()
  tracking_id: number;

  @Column()
  client_id: number;

  @Column({ type: 'date' })
  record_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  body_fat_percentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  chest_measurement: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  waist_measurement: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hip_measurement: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  arm_measurement: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  thigh_measurement: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.progress_trackings)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
