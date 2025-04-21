import { Injectable } from '@nestjs/common';
import { CreateMealFoodDto } from './dto/create-meal-food.dto';
import { UpdateMealFoodDto } from './dto/update-meal-food.dto';

@Injectable()
export class MealFoodsService {
  create(createMealFoodDto: CreateMealFoodDto) {
    return 'This action adds a new mealFood';
  }

  findAll() {
    return `This action returns all mealFoods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mealFood`;
  }

  update(id: number, updateMealFoodDto: UpdateMealFoodDto) {
    return `This action updates a #${id} mealFood`;
  }

  remove(id: number) {
    return `This action removes a #${id} mealFood`;
  }
}
