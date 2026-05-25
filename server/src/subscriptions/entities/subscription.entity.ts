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
import { Client } from '../../clients/entities/client.entity';
import { Coach } from '../../coaches/entities/coach.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum SubscriptionStatus {
  PENDING = 'pending', // Demande en attente
  ACTIVE = 'active', // Acceptée et active
  REJECTED = 'rejected', // Refusée par le coach
  EXPIRED = 'expired', // Expirée
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  subscription_id: number;

  @Column()
  client_id: number;

  @Column()
  coach_id: number;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  subscription_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.subscriptions)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Coach, (coach) => coach.subscriptions)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
