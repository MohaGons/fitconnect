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
import { RecipeFood } from '../../recipe-foods/entities/recipe-food.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column()
  coach_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  preparation_time: number;

  @Column({ nullable: true })
  cooking_time: number;

  @Column({ nullable: true })
  serving_size: number;

  @Column({ nullable: true })
  difficulty_level: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ nullable: true })
  calories_per_serving: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  protein_per_serving: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbs_per_serving: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fat_per_serving: number;

  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Coach, (coach) => coach.recipes)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @OneToMany(() => RecipeFood, (recipeFood) => recipeFood.recipe)
  recipe_foods: RecipeFood[];
}
