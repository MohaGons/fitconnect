import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealFoodDto } from './dto/create-meal-food.dto';
import { UpdateMealFoodDto } from './dto/update-meal-food.dto';
import { MealFood } from './entities/meal-food.entity';

@Injectable()
export class MealFoodsService {
  constructor(
    @InjectRepository(MealFood)
    private mealFoodRepository: Repository<MealFood>,
  ) {}

  async create(createMealFoodDto: CreateMealFoodDto): Promise<MealFood> {
    const mealFood = this.mealFoodRepository.create(createMealFoodDto);
    return await this.mealFoodRepository.save(mealFood);
  }

  async findAll(): Promise<MealFood[]> {
    return await this.mealFoodRepository.find({
      relations: ['food_item', 'meal'],
    });
  }

  async findByMealId(mealId: number): Promise<MealFood[]> {
    return await this.mealFoodRepository.find({
      where: { meal_id: mealId },
      relations: ['food_item'],
    });
  }

  async findOne(id: number): Promise<MealFood> {
    const mealFood = await this.mealFoodRepository.findOne({
      where: { meal_food_id: id },
      relations: ['food_item', 'meal'],
    });

    if (!mealFood) {
      throw new NotFoundException(`Meal food with ID ${id} not found`);
    }

    return mealFood;
  }

  async update(id: number, updateMealFoodDto: UpdateMealFoodDto): Promise<MealFood> {
    const mealFood = await this.findOne(id);
    Object.assign(mealFood, updateMealFoodDto);
    return await this.mealFoodRepository.save(mealFood);
  }

  async remove(id: number): Promise<void> {
    const mealFood = await this.findOne(id);
    await this.mealFoodRepository.remove(mealFood);
  }

  async removeByMealId(mealId: number): Promise<void> {
    await this.mealFoodRepository.delete({ meal_id: mealId });
  }
}
