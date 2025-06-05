import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsNumber()
  protein?: number;

  @IsOptional()
  @IsNumber()
  carbs?: number;

  @IsOptional()
  @IsNumber()
  fat?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
