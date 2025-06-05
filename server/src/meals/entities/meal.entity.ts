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
import { NutritionPlan } from '../../nutrition-plans/entities/nutrition-plan.entity';
import { MealFood } from '../../meal-foods/entities/meal-food.entity';
import { MealSchedule } from '../../meal-schedule/entities/meal-schedule.entity';
import { MealTracking } from '../../meal-tracking/entities/meal-tracking.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  meal_id: number;

  @Column()
  plan_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  meal_type: string;

  @Column({ nullable: true })
  calories: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  protein: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fat: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => NutritionPlan, (nutritionPlan) => nutritionPlan.meals)
  @JoinColumn({ name: 'plan_id' })
  nutrition_plan: NutritionPlan;

  @OneToMany(() => MealFood, (mealFood) => mealFood.meal, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  meal_foods: MealFood[];

  @OneToMany(() => MealSchedule, (mealSchedule) => mealSchedule.meal, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  meal_schedules: MealSchedule[];

  @OneToMany(() => MealTracking, (mealTracking) => mealTracking.meal, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  meal_trackings: MealTracking[];
}
