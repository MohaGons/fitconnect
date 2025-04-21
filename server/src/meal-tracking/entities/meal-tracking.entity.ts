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
import { Meal } from '../../meals/entities/meal.entity';
import { MealSchedule } from '../../meal-schedule/entities/meal-schedule.entity';

@Entity('meal_tracking')
export class MealTracking {
  @PrimaryGeneratedColumn()
  tracking_id: number;

  @Column()
  client_id: number;

  @Column()
  meal_id: number;

  @Column({ nullable: true })
  schedule_id: number;

  @Column({ type: 'date' })
  consumption_date: Date;

  @Column({ type: 'time', nullable: true })
  consumption_time: Date;

  @Column({ nullable: true })
  adherence_level: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  photo_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.meal_trackings)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Meal, (meal) => meal.meal_trackings)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => MealSchedule, (mealSchedule) => mealSchedule.meal_trackings)
  @JoinColumn({ name: 'schedule_id' })
  meal_schedule: MealSchedule;
}
