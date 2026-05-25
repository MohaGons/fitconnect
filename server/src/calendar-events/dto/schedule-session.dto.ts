import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ScheduleSessionDto {
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
    description: 'ID du programme à planifier',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  program_id: number;

  @ApiProperty({
    description: 'Date et heure de début de la séance',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  start_datetime: string;

  @ApiProperty({
    description: 'Date et heure de fin de la séance (optionnel)',
    example: '2024-01-15T11:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_datetime?: string;

  @ApiProperty({
    description: 'Durée de la séance',
    example: '60 min',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    description: 'Notes du coach pour cette séance',
    example: 'Attention aux échauffements',
    required: false,
  })
  @IsOptional()
  @IsString()
  coach_notes?: string;

  @ApiProperty({
    description: 'Statut de la séance',
    example: 'planned',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
