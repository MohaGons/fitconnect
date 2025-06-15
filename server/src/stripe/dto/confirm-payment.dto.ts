import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @IsNumber()
  @IsNotEmpty()
  coachId: number;
}
