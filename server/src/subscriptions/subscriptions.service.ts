import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { Client } from '../clients/entities/client.entity';
import { Coach } from '../coaches/entities/coach.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    // Vérifier que le client existe
    const client = await this.clientRepository.findOne({
      where: { client_id: createSubscriptionDto.client_id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Vérifier que le coach existe
    const coach = await this.coachRepository.findOne({
      where: { coach_id: createSubscriptionDto.coach_id },
    });
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      relations: ['client', 'coach', 'payments'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { subscription_id: id },
      relations: ['client', 'coach', 'payments'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async findByCoach(coachId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { coach_id: coachId },
      relations: ['client', 'payments'],
      order: { created_at: 'DESC' },
    });
  }

  async findByClient(clientId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { client_id: clientId },
      relations: ['coach', 'payments'],
      order: { created_at: 'DESC' },
    });
  }

  async findActiveSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { status: 'active' },
      relations: ['client', 'coach'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }

  // Méthodes utilitaires
  async getActiveSubscriptionBetween(
    coachId: number,
    clientId: number,
  ): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne({
      where: {
        coach_id: coachId,
        client_id: clientId,
        status: 'active',
      },
      relations: ['client', 'coach'],
    });
  }

  async expireSubscription(id: number): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.status = 'expired';
    return await this.subscriptionRepository.save(subscription);
  }
}
