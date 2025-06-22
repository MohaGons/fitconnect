import {
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  IsBoolean,
} from 'class-validator';

export class UpdateCoachDto {

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

  @IsOptional() 
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  certifications?: string;

  @IsOptional()
  @IsNumber()
  hourly_rate?: number;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  photo?: string; // Correction : ? ajouté

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
