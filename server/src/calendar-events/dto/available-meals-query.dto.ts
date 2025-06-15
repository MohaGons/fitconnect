import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class AvailableMealsQueryDto {
  @ApiPropertyOptional({
    description: 'ID du coach pour filtrer par nutrition plan',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  coachId?: number;

  @ApiPropertyOptional({
    description: 'ID du plan nutritionnel pour filtrer',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  planId?: number;
}
