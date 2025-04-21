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

@Entity('client_goals')
export class ClientGoal {
  @PrimaryGeneratedColumn()
  goal_id: number;

  @Column()
  client_id: number;

  @Column()
  description: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  creation_date: Date;

  @Column({ type: 'date', nullable: true })
  target_date: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  target_measurement: number;

  @Column({ nullable: true })
  measurement_unit: string;

  @Column({ nullable: true })
  priority: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.client_goals)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
