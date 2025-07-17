import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { FoodItem } from '../../food-items/entities/food-item.entity';

@Entity('recipe_foods')
export class RecipeFood {
  @PrimaryGeneratedColumn()
  recipe_food_id: number;

  @Column()
  recipe_id: number;

  @Column()
  food_id: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipe_foods)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => FoodItem, (foodItem) => foodItem.recipe_foods)
  @JoinColumn({ name: 'food_id' })
  food_item: FoodItem;
}
