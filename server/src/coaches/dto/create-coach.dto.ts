import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateCoachDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  certifications?: string;

  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @IsString()
  @IsOptional()
  availability?: string;

  @IsString()
  @IsOptional()
  photo_url?: string;
}
