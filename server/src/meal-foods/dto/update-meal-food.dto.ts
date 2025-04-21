import { PartialType } from '@nestjs/swagger';
import { CreateMealFoodDto } from './create-meal-food.dto';

export class UpdateMealFoodDto extends PartialType(CreateMealFoodDto) {}
