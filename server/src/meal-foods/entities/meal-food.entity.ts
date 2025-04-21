import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';
import { FoodItem } from '../../food-items/entities/food-item.entity';

@Entity('meal_foods')
export class MealFood {
  @PrimaryGeneratedColumn()
  meal_food_id: number;

  @Column()
  meal_id: number;

  @Column()
  food_id: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Meal, (meal) => meal.meal_foods)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => FoodItem, (foodItem) => foodItem.meal_foods)
  @JoinColumn({ name: 'food_id' })
  food_item: FoodItem;
}
