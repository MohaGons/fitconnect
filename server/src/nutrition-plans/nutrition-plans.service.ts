import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';
import { NutritionPlan } from './entities/nutrition-plan.entity';

@Injectable()
export class NutritionPlansService {
  constructor(
    @InjectRepository(NutritionPlan)
    private readonly nutritionPlanRepository: Repository<NutritionPlan>,
  ) {}

  async create(
    createNutritionPlanDto: CreateNutritionPlanDto,
  ): Promise<NutritionPlan> {
    const nutritionPlan = this.nutritionPlanRepository.create(
      createNutritionPlanDto,
    );
    return this.nutritionPlanRepository.save(nutritionPlan);
  }

  async findAll(filters: {
    page?: number;
    limit?: number;
    goal?: string;
    search?: string;
  }): Promise<{ data: NutritionPlan[]; total: number }> {
    const qb = this.nutritionPlanRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.coach', 'coach')
      .leftJoinAndSelect('plan.client', 'client');

    // DEBUG : log la valeur reçue
    console.log(
      '[DEBUG BACK] filters.goal =',
      filters.goal,
      'typeof =',
      typeof filters.goal,
    );
    console.log(
      '[DEBUG BACK] filters.search =',
      filters.search,
      'typeof =',
      typeof filters.search,
    );

    if (filters.goal) {
      qb.andWhere('plan.goal = :goal', { goal: filters.goal });
    }

    if (filters.search) {
      qb.andWhere('(plan.name ILIKE :search OR plan.comments ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.page && filters.limit) {
      qb.skip((filters.page - 1) * filters.limit);
    }
    if (filters.limit) {
      qb.take(filters.limit);
    }
    // DEBUG : log du SQL généré et des paramètres
    console.log('[DEBUG BACK] SQL généré :', qb.getSql());
    console.log('[DEBUG BACK] Params :', qb.getParameters());
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<NutritionPlan | null> {
    return this.nutritionPlanRepository.findOne({
      where: { plan_id: id },
      relations: ['coach', 'client', 'meals', 'meal_schedules'],
    });
  }

  async update(
    id: number,
    updateNutritionPlanDto: UpdateNutritionPlanDto,
  ): Promise<NutritionPlan | null> {
    await this.nutritionPlanRepository.update(id, updateNutritionPlanDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.nutritionPlanRepository.delete(id);
  }
}
