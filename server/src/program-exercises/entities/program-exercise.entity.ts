import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('program_exercises')
export class ProgramExercise {
  @PrimaryGeneratedColumn()
  program_exercise_id: number;

  @Column()
  program_id: number;

  @Column()
  exercise_id: number;

  @Column()
  order_number: number;

  @Column({ nullable: true })
  sets: number;

  @Column({ nullable: true })
  repetitions: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  recommended_weight: number;

  @Column({ nullable: true })
  duration_seconds: number;

  @Column({ nullable: true })
  rest_seconds: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Program, (program) => program.program_exercises)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => Exercise, (exercise) => exercise.program_exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
