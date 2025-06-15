import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID du client' })
  @IsNotEmpty()
  @IsNumber()
  client_id: number;

  @ApiProperty({ description: 'ID du coach' })
  @IsNotEmpty()
  @IsNumber()
  coach_id: number;

  @ApiProperty({ description: 'Date de début de la subscription' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'Date de fin de la subscription' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({
    description: 'Statut de la subscription',
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Montant de la subscription' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Type de subscription' })
  @IsNotEmpty()
  @IsString()
  subscription_type: string;
}
