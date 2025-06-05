import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './entities/meal.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

interface MealFilters {
  page?: number;
  limit?: number;
  plan_id?: number;
  meal_type?: string;
  search?: string;
}

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(MealFood)
    private mealFoodRepository: Repository<MealFood>,
  ) {}

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    const meal = this.mealRepository.create(createMealDto);
    return await this.mealRepository.save(meal);
  }

  async findAll(filters?: MealFilters): Promise<{ data: Meal[]; total: number }> {
    const queryBuilder = this.mealRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.nutrition_plan', 'nutrition_plan')
      .leftJoinAndSelect('nutrition_plan.client', 'client')
      .leftJoinAndSelect('nutrition_plan.coach', 'coach');

    // Filtrage par plan_id
    if (filters?.plan_id) {
      queryBuilder.where('meal.plan_id = :planId', {
        planId: filters.plan_id,
      });
    }

    // Filtrage par type de repas
    if (filters?.meal_type) {
      if (filters.plan_id) {
        queryBuilder.andWhere('meal.meal_type = :mealType', {
          mealType: filters.meal_type,
        });
      } else {
        queryBuilder.where('meal.meal_type = :mealType', {
          mealType: filters.meal_type,
        });
      }
    }

    // Filtrage par recherche
    if (filters?.search) {
      const whereCondition = 'meal.name ILIKE :search OR meal.instructions ILIKE :search';
      if (filters.plan_id || filters.meal_type) {
        queryBuilder.andWhere(whereCondition, {
          search: `%${filters.search}%`,
        });
      } else {
        queryBuilder.where(whereCondition, {
          search: `%${filters.search}%`,
        });
      }
    }

    // Tri par nom
    queryBuilder.orderBy('meal.name', 'ASC');

    // Comptage total pour la pagination
    const total = await queryBuilder.getCount();

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const data = await queryBuilder.getMany();

    return { data, total };
  }

  async findByPlanId(planId: number): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: { plan_id: planId },
      relations: ['nutrition_plan'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { meal_id: id },
      relations: ['nutrition_plan', 'nutrition_plan.client', 'nutrition_plan.coach'],
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return meal;
  }

  async update(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id);
    Object.assign(meal, updateMealDto);
    return await this.mealRepository.save(meal);
  }

  async remove(id: number): Promise<void> {
    const meal = await this.findOne(id);
    
    // Supprimer d'abord toutes les associations avec les ingrédients
    await this.mealFoodRepository.delete({ meal_id: id });
    
    // Ensuite supprimer le repas
    await this.mealRepository.remove(meal);
  }
}
