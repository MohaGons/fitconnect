import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateNutritionPlanDto {
  @ApiProperty({
    description: 'ID du coach',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  coach_id: number;

  @ApiProperty({
    description: 'ID du client',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  client_id: number;

  @ApiProperty({
    description: 'Nom du plan nutritionnel',
    example: 'Plan perte de poids une semaine',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Calories quotidiennes cibles',
    example: 1500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  daily_calories?: number;

  @ApiProperty({
    description: 'Objectif du plan',
    example: 'weight_loss',
    required: false,
  })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({
    description: 'Commentaires sur le plan',
    example: 'Il faut bien manger',
    required: false,
  })
  @IsOptional()
  @IsString()
  comments?: string;
}
