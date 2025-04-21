import { Injectable } from '@nestjs/common';
import { CreateMealTrackingDto } from './dto/create-meal-tracking.dto';
import { UpdateMealTrackingDto } from './dto/update-meal-tracking.dto';

@Injectable()
export class MealTrackingService {
  create(createMealTrackingDto: CreateMealTrackingDto) {
    return 'This action adds a new mealTracking';
  }

  findAll() {
    return `This action returns all mealTracking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mealTracking`;
  }

  update(id: number, updateMealTrackingDto: UpdateMealTrackingDto) {
    return `This action updates a #${id} mealTracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} mealTracking`;
  }
}
