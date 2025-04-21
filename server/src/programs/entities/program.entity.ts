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
import { Coach } from '../../coaches/entities/coach.entity';
import { ProgramExercise } from '../../program-exercises/entities/program-exercise.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn()
  program_id: number;

  @Column()
  coach_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  difficulty_level: string;

  @Column()
  category: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Coach, (coach) => coach.programs)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @OneToMany(
    () => ProgramExercise,
    (programExercise) => programExercise.program,
  )
  program_exercises: ProgramExercise[];

  @OneToMany(() => Session, (session) => session.program)
  sessions: Session[];
}
