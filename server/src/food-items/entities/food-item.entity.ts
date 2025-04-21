import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MealFood } from '../../meal-foods/entities/meal-food.entity';
import { RecipeFood } from '../../recipe-foods/entities/recipe-food.entity';

@Entity('food_items')
export class FoodItem {
  @PrimaryGeneratedColumn()
  food_id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  calories: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  protein: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fat: number;

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => MealFood, (mealFood) => mealFood.food_item)
  meal_foods: MealFood[];

  @OneToMany(() => RecipeFood, (recipeFood) => recipeFood.food_item)
  recipe_foods: RecipeFood[];
}
