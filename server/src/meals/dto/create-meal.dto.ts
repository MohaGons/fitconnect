import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  PRE_WORKOUT = 'pre_workout',
  POST_WORKOUT = 'post_workout',
}

export class CreateMealDto {
  @ApiProperty({
    description:
      'ID du plan nutritionnel (peut être null pour repas génériques)',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  plan_id?: number | null;

  @ApiProperty({
    description: 'Nom du repas',
    example: 'Prise de masse',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Type de repas',
    enum: MealType,
    example: MealType.BREAKFAST,
  })
  @IsOptional()
  @IsEnum(MealType)
  meal_type?: MealType | string;

  @ApiPropertyOptional({
    description: 'Calories totales du repas',
    example: 350,
    minimum: 0,
    maximum: 5000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5000)
  calories?: number;

  @ApiPropertyOptional({
    description: 'Protéines en grammes',
    example: 25,
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(500)
  protein?: number;

  @ApiPropertyOptional({
    description: 'Glucides en grammes',
    example: 45,
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(500)
  carbs?: number;

  @ApiPropertyOptional({
    description: 'Lipides en grammes',
    example: 15,
    minimum: 0,
    maximum: 200,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(200)
  fat?: number;

  @ApiPropertyOptional({
    description: 'Instructions de préparation',
    example: 'Mélange bien le riz avec les légumes',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
