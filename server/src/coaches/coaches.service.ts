import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Coach } from './entities/coach.entity';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

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

  async findAll(
    options: FindAllOptions = {},
  ): Promise<PaginatedResponse<Coach>> {
    try {
      const { page = 1, limit = 10, search, deleted } = options;
      const skip = (page - 1) * limit;

      // Construction des conditions WHERE
      const whereConditions: FindOptionsWhere<Coach> = {};

      // Filtre par statut supprimé si spécifié
      if (deleted !== undefined) {
        whereConditions.deleted = deleted;
      }

      // Construction des conditions de recherche
      let searchConditions: FindOptionsWhere<Coach>[] = [];
      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        // Recherche insensible à la casse sur plusieurs champs
        searchConditions = [
          { firstName: ILike(`%${searchTerm}%`) },
          { lastName: ILike(`%${searchTerm}%`) },
          { email: ILike(`%${searchTerm}%`) },
          { specialty: ILike(`%${searchTerm}%`) },
        ];
      }

      // Log pour déboguer
      console.log('Service - Find All Options:', {
        page,
        limit,
        search,
        deleted,
        skip,
        whereConditions,
        hasSearch: !!search,
      });

      // Requête principale avec les conditions
      const [coaches, total] = await this.coachRepository.findAndCount({
        where: search
          ? [
              ...searchConditions.map((condition) => ({
                ...whereConditions,
                ...condition,
              })),
            ]
          : whereConditions,
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      // Log des résultats
      console.log('Service - Résultats:', {
        coachesFound: coaches.length,
        total,
        searchApplied: !!search,
      });

      return {
        data: coaches,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error in findAll coaches:', error);
      throw error;
    }
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
    const coachProfile = await this.coachRepository.findOne({
      where: { user_id: userId },
    });
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
