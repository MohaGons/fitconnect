import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { stripeService } from "../services/stripeService";
import { useUserRole } from "../hooks/useUserRole";
import { STRIPE_CONFIG, STRIPE_ERRORS } from "../constants/stripe";

const stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);

interface PaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  paymentIntentId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { coachId, isLoading: isUserLoading } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError(STRIPE_ERRORS.MISSING_ELEMENTS);
      return;
    }

    if (isUserLoading) {
      onError("Chargement des informations de l'utilisateur en cours...");
      return;
    }

    if (!coachId) {
      onError("Informations du coach non disponibles");
      return;
    }

    setIsLoading(true);

    try {
      // Confirmer le paiement avec Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: STRIPE_CONFIG.CONFIRM_PARAMS,
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || STRIPE_ERRORS.PAYMENT_FAILED);
      } else {
        // Confirmer le paiement côté backend
        const result = await stripeService.confirmPayment({
          paymentIntentId,
          coachId: Number(coachId), // S'assurer que coachId est un nombre
        });

        if (result.success) {
          onSuccess();
        } else {
          onError(result.message);
        }
      }
    } catch (err) {
      console.error("Erreur de paiement:", err);
      onError(STRIPE_ERRORS.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading || isUserLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {isLoading || isUserLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Traitement...
          </div>
        ) : (
          `Payer ${STRIPE_CONFIG.SUBSCRIPTION_AMOUNT.toLocaleString("fr-FR")} €`
        )}
      </button>
    </form>
  );
};

interface StripePaymentFormProps {
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  const options = {
    clientSecret: props.clientSecret,
    appearance: STRIPE_CONFIG.APPEARANCE,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
