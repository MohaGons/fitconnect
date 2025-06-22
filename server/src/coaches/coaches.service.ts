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

  async findAll(): Promise<Coach[]> {
    return await this.coachRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Coach> {
    const coach = await this.coachRepository.findOne({
      where: { coach_id: id },
    });

    if (!coach) {
      throw new NotFoundException(`Coach with id ${id} not found`);
    }

    return coach;
  }


async getCoachProfile(userId: string) {
  const coachProfile = await this.coachRepository.findOne({ where: { user_id: userId } });
  if (!coachProfile) {
    throw new NotFoundException(`Coach non trouvé pour l'userId: ${userId}`);
  }
  return coachProfile;
}

async update(id: number, updateCoachDto: UpdateCoachDto): Promise<Coach> {
  const coach = await this.findOne(id);
  Object.assign(coach, updateCoachDto);
  return await this.coachRepository.save(coach);
}

async remove(id: number): Promise<void> {
  const result = await this.coachRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException(`Coach with id ${id} not found`);
  }
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
