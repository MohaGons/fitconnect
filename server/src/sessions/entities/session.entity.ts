import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Program } from '../../programs/entities/program.entity';
import { SessionExercise } from '../../session-exercises/entities/session-exercise.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column()
  client_id: number;

  @Column()
  program_id: number;

  @Column({ type: 'date' })
  session_date: Date;

  @Column({ type: 'time', nullable: true })
  start_time: Date;

  @Column({ type: 'time', nullable: true })
  end_time: Date;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.sessions)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Program, (program) => program.sessions)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @OneToMany(
    () => SessionExercise,
    (sessionExercise) => sessionExercise.session,
  )
  session_exercises: SessionExercise[];
}
