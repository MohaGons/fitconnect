import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

enum Category {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  FLEXIBILITY = 'flexibility',
  HIIT = 'hiit',
  FUNCTIONAL = 'functional',
  REHABILITATION = 'rehabilitation',
}

export class CreateProgramExerciseDto {
  @ApiProperty({ description: "ID de l'exercice" })
  @IsNumber()
  @IsPositive()
  exercise_id: number;

  @ApiProperty({ description: "Ordre de l'exercice dans le programme" })
  @IsNumber()
  @Min(1)
  order_number: number;

  @ApiProperty({ description: 'Nombre de séries', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sets?: number;

  @ApiProperty({ description: 'Nombre de répétitions', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  repetitions?: number;

  @ApiProperty({ description: 'Poids recommandé en kg', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  recommended_weight?: number;

  @ApiProperty({ description: 'Durée en secondes', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  duration_seconds?: number;

  @ApiProperty({ description: 'Temps de repos en secondes', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rest_seconds?: number;

  @ApiProperty({
    description: 'Instructions spécifiques pour cet exercice',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateProgramDto {
  @ApiProperty({ description: 'ID du coach' })
  @IsNumber()
  @IsPositive()
  coach_id: number;

  @ApiProperty({ description: 'Nom du programme' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description du programme', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Niveau de difficulté',
    enum: DifficultyLevel,
    example: 'beginner',
  })
  @IsEnum(DifficultyLevel)
  difficulty_level: string;

  @ApiProperty({
    description: 'Catégorie du programme',
    enum: Category,
    example: 'strength',
  })
  @IsEnum(Category)
  category: string;

  @ApiProperty({
    description: 'Liste des exercices du programme',
    type: [CreateProgramExerciseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProgramExerciseDto)
  exercises: CreateProgramExerciseDto[];
}
