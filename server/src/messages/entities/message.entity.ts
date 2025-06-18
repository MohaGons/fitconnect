import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column({ type: 'int', nullable: true })
  sender_coach_id: number | null;

  @Column({ type: 'int', nullable: true })
  sender_client_id: number | null;

  @Column({ type: 'int', nullable: true })
  recipient_coach_id: number | null;

  @Column({ type: 'int', nullable: true })
  recipient_client_id: number | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sent_date: Date;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'varchar', nullable: true })
  message_type: string | null;

  @Column({ type: 'varchar', nullable: true })
  attachment_url: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Coach, { nullable: true })
  @JoinColumn({ name: 'sender_coach_id' })
  sender_coach: Coach | null;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'sender_client_id' })
  sender_client: Client | null;

  @ManyToOne(() => Coach, { nullable: true })
  @JoinColumn({ name: 'recipient_coach_id' })
  recipient_coach: Coach | null;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'recipient_client_id' })
  recipient_client: Client | null;
}
