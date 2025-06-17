import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus } from '../entities/subscription.entity';

export class UpdateSubscriptionStatusDto {
  @ApiProperty({
    description: 'Nouveau statut de la subscription',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Date de début (obligatoire si acceptée)',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Date de fin (obligatoire si acceptée)',
    example: '2024-07-15',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
