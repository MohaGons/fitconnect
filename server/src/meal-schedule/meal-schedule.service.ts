import { Injectable } from '@nestjs/common';
import { CreateMealScheduleDto } from './dto/create-meal-schedule.dto';
import { UpdateMealScheduleDto } from './dto/update-meal-schedule.dto';

@Injectable()
export class MealScheduleService {
  create(createMealScheduleDto: CreateMealScheduleDto) {
    return 'This action adds a new mealSchedule';
  }

  findAll() {
    return `This action returns all mealSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mealSchedule`;
  }

  update(id: number, updateMealScheduleDto: UpdateMealScheduleDto) {
    return `This action updates a #${id} mealSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} mealSchedule`;
  }
}
