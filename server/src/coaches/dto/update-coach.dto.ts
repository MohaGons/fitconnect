import {
  IsNotEmpty,
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


  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsBoolean()
deleted?: boolean;
}
