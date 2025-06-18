import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum UserType {
  COACH = 'coach',
  CLIENT = 'client',
}

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  sender_id: number;

  @IsEnum(UserType)
  @IsNotEmpty()
  sender_type: UserType;

  @IsNumber()
  @IsNotEmpty()
  recipient_id: number;

  @IsEnum(UserType)
  @IsNotEmpty()
  recipient_type: UserType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  message_type?: string;

  @IsOptional()
  @IsString()
  attachment_url?: string;
}
