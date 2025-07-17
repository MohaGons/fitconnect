import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Matches,
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
    description: 'Date et heure de début (ISO 8601)',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, {
    message: 'start_datetime must be a valid ISO 8601 date string',
  })
  start_datetime: string;
  @ApiPropertyOptional({
    description: 'Date et heure de fin (optionnel, ISO 8601)',
    example: '2024-01-15T11:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, {
    message: 'end_datetime must be a valid ISO 8601 date string',
  })
  end_datetime?: string;

  @ApiPropertyOptional({
    description: "Statut de l'événement",
    example: 'planned',
    default: 'planned',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Notes du coach',
    example: 'Attention aux échauffements',
  })
  @IsOptional()
  @IsString()
  coach_notes?: string;

  @ApiPropertyOptional({
    description: 'Notes du client',
    example: 'Séance difficile mais motivante',
  })
  @IsOptional()
  @IsString()
  client_notes?: string;

  // Session-specific fields
  @ApiPropertyOptional({
    description: 'Type de séance (pour les événements de type session)',
    example: 'musculation',
  })
  @IsOptional()
  @IsString()
  session_type?: string;

  @ApiPropertyOptional({
    description: 'Durée de la séance',
    example: '60 min',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: 'ID du programme associé (pour les séances)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  program_id?: number;

  @ApiPropertyOptional({
    description: 'Type de repas (pour les événements de type meal)',
    example: 'dejeuner',
  })
  @IsOptional()
  @IsString()
  meal_type?: string;

  @ApiPropertyOptional({
    description: 'Nombre de calories du repas',
    example: 450,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({
    description: 'ID du repas associé (pour les repas)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  meal_id?: number;
}
