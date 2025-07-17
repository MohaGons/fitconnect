import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProgramExercise } from '../../program-exercises/entities/program-exercise.entity';
import { SessionExercise } from '../../session-exercises/entities/session-exercise.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  exercise_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  muscle_category: string;

  @Column()
  difficulty_level: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  video_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ProgramExercise,
    (programExercise) => programExercise.exercise,
  )
  program_exercises: ProgramExercise[];

  @OneToMany(
    () => SessionExercise,
    (sessionExercise) => sessionExercise.exercise,
  )
  session_exercises: SessionExercise[];
}
