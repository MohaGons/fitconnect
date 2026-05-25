import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID du client' })
  @IsNotEmpty()
  @IsNumber()
  client_id: number;

  @ApiProperty({ description: 'ID du coach' })
  @IsNotEmpty()
  @IsNumber()
  coach_id: number;

  @ApiPropertyOptional({ description: 'Date de début de la subscription' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Date de fin de la subscription' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Statut de la subscription',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({ description: 'Montant de la subscription' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Type de subscription' })
  @IsNotEmpty()
  @IsString()
  subscription_type: string;
}
