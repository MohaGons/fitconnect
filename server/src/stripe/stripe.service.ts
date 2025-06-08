import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency,
      metadata: {
        type: 'coach_subscription',
      },
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      name,
    });
  }
}
