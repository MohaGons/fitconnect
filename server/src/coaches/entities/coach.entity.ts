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
import { User } from '../../users/entities/user.entity';
import { Program } from '../../programs/entities/program.entity';
import { NutritionPlan } from '../../nutrition-plans/entities/nutrition-plan.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn()
  coach_id: number;

  @Column()
  user_id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.coach)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
