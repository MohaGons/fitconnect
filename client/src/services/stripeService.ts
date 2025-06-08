import apiClient from "../api/axios";

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  coachId: number;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  paymentIntentId?: string;
  status?: string;
}

export const stripeService = {
  async createPaymentIntent(amount: number): Promise<PaymentIntentResponse> {
    const response = await apiClient.post("/stripe/create-payment-intent", {
      amount,
    });
    return response.data;
  },

  async confirmPayment(
    data: ConfirmPaymentRequest
  ): Promise<ConfirmPaymentResponse> {
    const response = await apiClient.post("/stripe/confirm-payment", data);
    return response.data;
  },

  async getPaymentStatus(paymentIntentId: string) {
    const response = await apiClient.get(
      `/stripe/payment-status/${paymentIntentId}`
    );
    return response.data;
  },
};
