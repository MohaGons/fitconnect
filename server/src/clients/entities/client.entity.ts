import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Session } from '../../sessions/entities/session.entity';
import { ProgressTracking } from '../../progress-tracking/entities/progress-tracking.entity';
import { ProgressPhoto } from '../../progress-photos/entities/progress-photo.entity';
import { ClientGoal } from '../../client-goals/entities/client-goal.entity';
import { NutritionPlan } from '../../nutrition-plans/entities/nutrition-plan.entity';
import { MealTracking } from '../../meal-tracking/entities/meal-tracking.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  client_id: number;

  @Column({ type: 'uuid' })
  user_id: string; // UUID venant de Keycloak

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'text', nullable: true })
  gendre: String;

  @Column({ type: 'text', nullable: true })
  firstName: String;

  @Column({ type: 'text', nullable: true })
  lastName: String;

  @Column({ type: 'text', nullable: true })
  email: String;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ nullable: true })
  goal: string;

  @Column({ type: 'text', nullable: true })
  dietary_restrictions: string;

  @Column({ type: 'text', nullable: true })
  health_issues: string;

  @Column({ type: 'text', nullable: true })
  sport_experience: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'boolean', default: false })
  termsAccepted: boolean;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  // Relations avec d'autres entités
  @OneToMany(() => Subscription, (subscription) => subscription.client)
  subscriptions: Subscription[];

  @OneToMany(() => Session, (session) => session.client)
  sessions: Session[];

  @OneToMany(
    () => ProgressTracking,
    (progressTracking) => progressTracking.client,
  )
  progress_trackings: ProgressTracking[];

  @OneToMany(() => ProgressPhoto, (progressPhoto) => progressPhoto.client)
  progress_photos: ProgressPhoto[];

  @OneToMany(() => ClientGoal, (clientGoal) => clientGoal.client)
  client_goals: ClientGoal[];

  @OneToMany(() => NutritionPlan, (nutritionPlan) => nutritionPlan.client)
  nutrition_plans: NutritionPlan[];

  @OneToMany(() => MealTracking, (mealTracking) => mealTracking.client)
  meal_trackings: MealTracking[];

  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[];
}
