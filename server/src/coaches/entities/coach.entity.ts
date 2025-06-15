import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { NutritionPlan } from '../../nutrition-plans/entities/nutrition-plan.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn()
  coach_id: number;

  @Column({ type: 'uuid' })
  user_id: string; // UUID venant de Keycloak

  @Column()
  specialty: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  certifications: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_rate: number;

  @Column({ type: 'text', nullable: true })
  availability: string;

  @Column({ type: 'text', nullable: true })
  photo_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations avec d'autres entités
  @OneToMany(() => Program, (program) => program.coach)
  programs: Program[];

  @OneToMany(() => NutritionPlan, (nutritionPlan) => nutritionPlan.coach)
  nutrition_plans: NutritionPlan[];

  @OneToMany(() => Subscription, (subscription) => subscription.coach)
  subscriptions: Subscription[];

  @OneToMany(() => Review, (review) => review.coach)
  reviews: Review[];

  @OneToMany(() => Recipe, (recipe) => recipe.coach)
  recipes: Recipe[];
}
