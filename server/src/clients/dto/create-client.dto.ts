import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsString,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreateClientDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

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
  @IsNumberString()
  weight?: string;

  @IsOptional()
  @IsNumberString()
  height?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsString()
  dietary_restrictions?: string;

  @IsOptional()
  @IsString()
  health_issues?: string;

  @IsOptional()
  @IsString()
  sport_experience?: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsBoolean()
  termsAccepted: boolean;
}
