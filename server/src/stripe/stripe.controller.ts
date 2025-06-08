import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CoachesService } from '../coaches/coaches.service';

export class CreatePaymentIntentDto {
  amount: number;
}

export class ConfirmPaymentDto {
  paymentIntentId: string;
  coachId: number;
}

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly coachesService: CoachesService,
  ) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    const { amount } = createPaymentIntentDto;
    const paymentIntent = await this.stripeService.createPaymentIntent(amount);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    const { paymentIntentId, coachId } = confirmPaymentDto;

    // Vérifier le statut du paiement
    const paymentIntent =
      await this.stripeService.confirmPayment(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Mettre à jour le statut d'abonnement du coach
      await this.coachesService.updateSubscriptionStatus(
        coachId,
        'active',
        paymentIntentId,
      );

      return {
        success: true,
        message: 'Paiement confirmé et abonnement activé',
        paymentIntentId,
      };
    }

    return {
      success: false,
      message: 'Paiement non confirmé',
      status: paymentIntent.status,
    };
  }

  @Get('payment-status/:paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    const paymentIntent =
      await this.stripeService.confirmPayment(paymentIntentId);
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    };
  }
}
