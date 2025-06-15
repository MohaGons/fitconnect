import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber , Matches } from 'class-validator';

export class CreateCoachDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  @IsString()
  @Matches(/^(Homme|Femme)$/)
  gendre?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

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
