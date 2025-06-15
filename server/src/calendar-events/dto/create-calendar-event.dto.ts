import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateCalendarEventDto {
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
    description: "Titre de l'événement",
    example: 'Séance Jambes',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: ['session', 'meal'],
    description: "Type d'événement",
    example: 'session',
  })
  @IsNotEmpty()
  @IsEnum(['session', 'meal'])
  type: 'session' | 'meal';

  @ApiProperty({
    description: 'Date et heure de début',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  start_datetime: Date;

  @ApiProperty({
    required: false,
    description: 'Date et heure de fin (optionnel)',
    example: '2024-01-15T11:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  end_datetime?: Date;

  @ApiProperty({
    required: false,
    description: "Statut de l'événement",
    example: 'planned',
    default: 'planned',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Notes du coach',
    example: 'Attention aux échauffements',
  })
  @IsOptional()
  @IsString()
  coach_notes?: string;

  @ApiProperty({
    required: false,
    description: 'Notes du client',
    example: 'Séance difficile mais motivante',
  })
  @IsOptional()
  @IsString()
  client_notes?: string;

  // Session-specific fields
  @ApiProperty({
    required: false,
    description: 'Type de séance (pour les événements de type session)',
    example: 'musculation',
  })
  @IsOptional()
  @IsString()
  session_type?: string;

  @ApiProperty({
    required: false,
    description: 'Durée de la séance',
    example: '60 min',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    required: false,
    description: 'ID du programme associé (pour les séances)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  program_id?: number;

  // Meal-specific fields
  @ApiProperty({
    required: false,
    description: 'Type de repas (pour les événements de type meal)',
    example: 'dejeuner',
  })
  @IsOptional()
  @IsString()
  meal_type?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre de calories du repas',
    example: 450,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiProperty({
    required: false,
    description: 'ID du repas associé (pour les repas)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  meal_id?: number;
}
