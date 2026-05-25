import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { Client } from '../../clients/entities/client.entity';
import { Program } from '../../programs/entities/program.entity';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column()
  coach_id: number;

  @Column()
  client_id: number;

  @Column()
  title: string;

  @Column()
  type: 'session' | 'meal';

  @Column({ type: 'timestamp' })
  start_datetime: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_datetime?: Date;

  @Column({ default: 'planned' })
  status: string;

  @Column({ type: 'text', nullable: true })
  coach_notes: string;

  @Column({ type: 'text', nullable: true })
  client_notes: string;

  // Champs spécifiques aux séances
  @Column({ nullable: true })
  session_type: string; // musculation, cardio, hiit, yoga

  @Column({ nullable: true })
  duration: string; // "60 min", "1h30"

  @Column({ nullable: true })
  program_id: number;

  // Champs spécifiques aux repas
  @Column({ nullable: true })
  meal_type: string; // petit-dejeuner, dejeuner, diner, etc.

  @Column({ nullable: true })
  calories: number;

  @Column({ nullable: true })
  meal_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Coach, (coach) => coach.coach_id)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @ManyToOne(() => Client, (client) => client.client_id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Program, (program) => program.program_id, { nullable: true })
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
