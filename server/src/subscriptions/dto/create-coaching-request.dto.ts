import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCoachingRequestDto {
  @ApiProperty({ description: 'ID du client qui fait la demande' })
  @IsNotEmpty()
  @IsNumber()
  client_id: number;

  @ApiProperty({ description: 'ID du coach demandé' })
  @IsNotEmpty()
  @IsNumber()
  coach_id: number;

  @ApiPropertyOptional({ description: 'Message personnalisé du client' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Type de coaching demandé' })
  @IsOptional()
  @IsString()
  subscription_type?: string;
}
