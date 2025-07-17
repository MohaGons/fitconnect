import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ScheduleMealDto {
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
    description: 'ID du repas à planifier',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  meal_id: number;

  @ApiProperty({
    description: 'Date et heure du repas',
    example: '2024-01-15T12:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  start_datetime: string;

  @ApiProperty({
    description: 'Date et heure de fin du repas (optionnel)',
    example: '2024-01-15T12:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_datetime?: string;

  @ApiProperty({
    description: 'Notes du coach pour ce repas',
    example: "À prendre 30 minutes avant l'entraînement",
    required: false,
  })
  @IsOptional()
  @IsString()
  coach_notes?: string;

  @ApiProperty({
    description: 'Statut du repas',
    example: 'planned',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
