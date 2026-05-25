import { IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
