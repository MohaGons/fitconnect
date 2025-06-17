import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CreateCoachingRequestDto } from './dto/create-coaching-request.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
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
      where: { status: SubscriptionStatus.ACTIVE },
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
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['client', 'coach'],
    });
  }

  async expireSubscription(id: number): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.status = SubscriptionStatus.EXPIRED;
    return await this.subscriptionRepository.save(subscription);
  }

  // Nouvelles méthodes pour les demandes de coaching
  async createCoachingRequest(
    createCoachingRequestDto: CreateCoachingRequestDto,
  ): Promise<Subscription> {
    // Vérifier que le client existe
    const client = await this.clientRepository.findOne({
      where: { client_id: createCoachingRequestDto.client_id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Vérifier que le coach existe et a un abonnement actif
    const coach = await this.coachRepository.findOne({
      where: { coach_id: createCoachingRequestDto.coach_id },
    });
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }
    if (coach.subscription_status !== 'active') {
      throw new BadRequestException(
        'Coach does not have an active subscription',
      );
    }

    // Vérifier qu'il n'y a pas déjà une demande en attente ou une relation active
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        client_id: createCoachingRequestDto.client_id,
        coach_id: createCoachingRequestDto.coach_id,
        status: SubscriptionStatus.PENDING,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'A request is already pending with this coach',
      );
    }

    const activeSubscription = await this.subscriptionRepository.findOne({
      where: {
        client_id: createCoachingRequestDto.client_id,
        coach_id: createCoachingRequestDto.coach_id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (activeSubscription) {
      throw new BadRequestException(
        'You already have an active subscription with this coach',
      );
    }

    // Créer la demande
    const subscriptionData: Partial<Subscription> = {
      client_id: createCoachingRequestDto.client_id,
      coach_id: createCoachingRequestDto.coach_id,
      status: SubscriptionStatus.PENDING,
      amount: coach.hourly_rate || 0,
      subscription_type:
        createCoachingRequestDto.subscription_type || 'coaching',
      // start_date et end_date sont nullable, donc on les omets pour les demandes en attente
    };

    const subscription = this.subscriptionRepository.create(subscriptionData);
    return await this.subscriptionRepository.save(subscription);
  }

  async updateSubscriptionStatus(
    id: number,
    updateStatusDto: UpdateSubscriptionStatusDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    // Vérifier que la demande est en statut PENDING pour pouvoir la modifier
    if (subscription.status !== SubscriptionStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be modified');
    }

    // Si on accepte la demande, on doit avoir les dates
    if (updateStatusDto.status === SubscriptionStatus.ACTIVE) {
      if (!updateStatusDto.start_date || !updateStatusDto.end_date) {
        throw new BadRequestException(
          'Start and end dates are required when accepting a request',
        );
      }
      subscription.start_date = new Date(updateStatusDto.start_date);
      subscription.end_date = new Date(updateStatusDto.end_date);
    }

    subscription.status = updateStatusDto.status;
    return await this.subscriptionRepository.save(subscription);
  }

  async getPendingRequestsByCoach(coachId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        coach_id: coachId,
        status: SubscriptionStatus.PENDING,
      },
      relations: ['client'],
      order: { created_at: 'DESC' },
    });
  }

  async getActiveClientsByCoach(coachId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        coach_id: coachId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['client'],
      order: { created_at: 'DESC' },
    });
  }

  async getActiveCoachByClient(clientId: number): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne({
      where: {
        client_id: clientId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['coach'],
      order: { created_at: 'DESC' },
    });
  }

  async getClientRequests(clientId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        client_id: clientId,
      },
      relations: ['coach'],
      order: { created_at: 'DESC' },
    });
  }
}
