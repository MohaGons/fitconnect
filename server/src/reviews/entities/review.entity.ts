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
import { Coach } from '../../coaches/entities/coach.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  client_id: number;

  @Column()
  coach_id: number;

  @Column()
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  review_date: Date;

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.reviews)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Coach, (coach) => coach.reviews)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;
}
