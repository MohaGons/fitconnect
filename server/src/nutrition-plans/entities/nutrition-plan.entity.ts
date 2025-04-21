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
import { Client } from '../../clients/entities/client.entity';
import { Meal } from '../../meals/entities/meal.entity';
import { MealSchedule } from '../../meal-schedule/entities/meal-schedule.entity';

@Entity('nutrition_plans')
export class NutritionPlan {
  @PrimaryGeneratedColumn()
  plan_id: number;

  @Column()
  coach_id: number;

  @Column()
  client_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @Column({ nullable: true })
  daily_calories: number;

  @Column({ nullable: true })
  goal: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Coach, (coach) => coach.nutrition_plans)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @ManyToOne(() => Client, (client) => client.nutrition_plans)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Meal, (meal) => meal.nutrition_plan)
  meals: Meal[];

  @OneToMany(() => MealSchedule, (mealSchedule) => mealSchedule.nutrition_plan)
  meal_schedules: MealSchedule[];
}
