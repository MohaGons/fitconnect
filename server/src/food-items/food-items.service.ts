import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { FoodItem } from './entities/food-item.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

interface FoodItemFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
    @InjectRepository(MealFood)
    private mealFoodRepository: Repository<MealFood>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = this.foodItemRepository.create(createFoodItemDto);
    return await this.foodItemRepository.save(foodItem);
  }

  async findAll(
    filters?: FoodItemFilters,
  ): Promise<{ data: FoodItem[]; total: number }> {
    const queryBuilder =
      this.foodItemRepository.createQueryBuilder('food_item');

    // Filtrage par recherche
    if (filters?.search) {
      queryBuilder.where(
        'food_item.name ILIKE :search OR food_item.category ILIKE :search',
        {
          search: `%${filters.search}%`,
        },
      );
    }

    // Filtrage par catégorie
    if (filters?.category) {
      if (filters.search) {
        queryBuilder.andWhere('food_item.category = :category', {
          category: filters.category,
        });
      } else {
        queryBuilder.where('food_item.category = :category', {
          category: filters.category,
        });
      }
    }

    // Tri par nom
    queryBuilder.orderBy('food_item.name', 'ASC');

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

  async findOne(id: number): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { food_id: id },
    });

    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }

    return foodItem;
  }

  async update(
    id: number,
    updateFoodItemDto: UpdateFoodItemDto,
  ): Promise<FoodItem> {
    const foodItem = await this.findOne(id);
    Object.assign(foodItem, updateFoodItemDto);
    return await this.foodItemRepository.save(foodItem);
  }

  async remove(id: number): Promise<void> {
    const foodItem = await this.findOne(id);

    // Supprimer d'abord toutes les associations avec les repas
    await this.mealFoodRepository.delete({ food_id: id });

    // Ensuite supprimer l'ingrédient
    await this.foodItemRepository.remove(foodItem);
  }

  async findByCategory(category: string): Promise<FoodItem[]> {
    return await this.foodItemRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }
}
