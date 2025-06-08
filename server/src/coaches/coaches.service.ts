import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from './entities/coach.entity';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    const coach = this.coachRepository.create(createCoachDto);
    return await this.coachRepository.save(coach);
  }

  async findByUserId(
    userId: string,
  ): Promise<{ coach_id: number; subscription_status: string }> {
    const coach = await this.coachRepository.findOne({
      where: { user_id: userId },
      select: ['coach_id', 'subscription_status'], // Récupérer coach_id + subscription_status
    });

    if (!coach) {
      throw new NotFoundException(`Coach with user_id ${userId} not found`);
    }

    return {
      coach_id: coach.coach_id,
      subscription_status: coach.subscription_status,
    };
  }

  findAll() {
    return `This action returns all coaches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coach`;
  }

  update(id: number, updateCoachDto: UpdateCoachDto) {
    return `This action updates a #${id} coach`;
  }

  remove(id: number) {
    return `This action removes a #${id} coach`;
  }

  async updateSubscriptionStatus(
    coachId: number,
    status: string,
    paymentIntentId?: string,
  ): Promise<Coach> {
    const coach = await this.coachRepository.findOne({
      where: { coach_id: coachId },
    });

    if (!coach) {
      throw new NotFoundException(`Coach with id ${coachId} not found`);
    }

    coach.subscription_status = status;

    if (status === 'active') {
      coach.subscription_activated_at = new Date();
    }

    if (paymentIntentId) {
      coach.stripe_payment_intent_id = paymentIntentId;
    }

    return await this.coachRepository.save(coach);
  }
}
