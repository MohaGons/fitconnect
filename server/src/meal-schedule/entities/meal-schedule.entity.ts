import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { NutritionPlan } from '../../nutrition-plans/entities/nutrition-plan.entity';
import { Meal } from '../../meals/entities/meal.entity';
import { MealTracking } from '../../meal-tracking/entities/meal-tracking.entity';

@Entity('meal_schedule')
export class MealSchedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @Column()
  plan_id: number;

  @Column()
  meal_id: number;

  @Column()
  day_of_week: number;

  @Column({ nullable: true })
  week_number: number;

  @Column({ type: 'time', nullable: true })
  time_of_day: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => NutritionPlan,
    (nutritionPlan) => nutritionPlan.meal_schedules,
  )
  @JoinColumn({ name: 'plan_id' })
  nutrition_plan: NutritionPlan;

  @ManyToOne(() => Meal, (meal) => meal.meal_schedules)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @OneToMany(() => MealTracking, (mealTracking) => mealTracking.meal_schedule)
  meal_trackings: MealTracking[];
}
