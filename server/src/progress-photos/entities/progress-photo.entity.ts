import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('progress_photos')
export class ProgressPhoto {
  @PrimaryGeneratedColumn()
  photo_id: number;

  @Column()
  client_id: number;

  @Column({ type: 'date' })
  photo_date: Date;

  @Column()
  photo_url: string;

  @Column({ nullable: true })
  photo_type: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.progress_photos)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
