import { IsNumber, IsString } from 'class-validator';

export class CreateMealFoodDto {
  @IsNumber()
  meal_id: number;

  @IsNumber()
  food_id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}
