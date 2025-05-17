import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}
enum MuscleCategory {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  LEGS = 'legs',
  CORE = 'core',
  FULL_BODY = 'full_body',
  CARDIO = 'cardio',
}
export class CreateExerciseDto {
  @ApiProperty({ description: 'The name of the exercise' })
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({
    description: 'The description of the exercise',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty({
    description: 'Catégorie de muscle ciblée',
    enum: MuscleCategory,
    example: 'chest',
  })
  @IsEnum(MuscleCategory)
  muscle_category: string;
  @ApiProperty({ description: 'The difficulty level of the exercise' })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty_level: string;
  @ApiProperty({ description: "URL de l'image de l'exercice", required: false })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'URL de la vidéo démonstrative',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  video_url?: string;
}
