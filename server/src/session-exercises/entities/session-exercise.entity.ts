import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('session_exercises')
export class SessionExercise {
  @PrimaryGeneratedColumn()
  session_exercise_id: number;

  @Column()
  session_id: number;

  @Column()
  exercise_id: number;

  @Column({ nullable: true })
  sets_completed: number;

  @Column({ nullable: true })
  repetitions_completed: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  weight_used: number;

  @Column({ nullable: true })
  duration_seconds_completed: number;

  @Column({ nullable: true })
  perceived_difficulty: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Session, (session) => session.session_exercises)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Exercise, (exercise) => exercise.session_exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
