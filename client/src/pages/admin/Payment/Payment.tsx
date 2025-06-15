import React, { useState } from "react";
import { useCoachId } from "../../../hooks/useCoachId";
import { stripeService } from "../../../services/stripeService";
import StripePaymentForm from "../../../components/StripePaymentForm";
import { STRIPE_CONFIG } from "../../../constants/stripe";

const Payment: React.FC = () => {
  const { subscriptionStatus, hasActiveSubscription, isLoading, refetch } =
    useCoachId();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
  } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleStartPayment = async () => {
    setPaymentLoading(true);
    setError(null);

    try {
      const response = await stripeService.createPaymentIntent(
        STRIPE_CONFIG.SUBSCRIPTION_AMOUNT
      );
      setPaymentData(response);
      setShowPaymentForm(true);
    } catch (err) {
      setError("Erreur lors de l'initialisation du paiement");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSuccess(true);
    setShowPaymentForm(false);
    refetch(); // Recharger les données du coach
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setShowPaymentForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (hasActiveSubscription || success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            {success ? "Paiement Réussi !" : "Abonnement Actif"}
          </h1>
          <p className="text-green-600">
            {success
              ? "Votre abonnement PRO a été activé avec succès !"
              : "Votre abonnement PRO est actif. Profitez de toutes les fonctionnalités !"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Débloquez toutes les fonctionnalités
        </h1>
        <p className="text-lg text-gray-600">
          Accédez à l'ensemble de la plateforme avec un abonnement PRO
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-orange-500 mb-2">
            {STRIPE_CONFIG.SUBSCRIPTION_AMOUNT}€
          </div>
          <div className="text-gray-600">Paiement unique</div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Gestion complète des clients</span>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Programmes d'entraînement illimités</span>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Plans nutritionnels personnalisés</span>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Messagerie intégrée</span>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Suivi des progrès en temps réel</span>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✓</div>
            <span>Facturation automatisée</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {showPaymentForm && paymentData ? (
          <StripePaymentForm
            clientSecret={paymentData.clientSecret}
            paymentIntentId={paymentData.paymentIntentId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        ) : (
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            onClick={handleStartPayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Initialisation...
              </div>
            ) : (
              "Souscrire maintenant"
            )}
          </button>
        )}

        <div className="text-center mt-4 text-sm text-gray-500">
          Paiement sécurisé par Stripe
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Statut actuel :{" "}
        <span className="font-medium">{subscriptionStatus}</span>
      </div>
    </div>
  );
};

export default Payment;
