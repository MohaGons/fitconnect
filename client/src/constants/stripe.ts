// Configuration Stripe
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51MfRFGCMBvQfTrL5zaAYZa6esabVRWnIMj5y6bPWU6l1RGmYTizrgZbA9ZmuhzbhpsSBuUHHd8lUc8KRpmZCZobI00ROPqmaqY",

  SUBSCRIPTION_AMOUNT: 50, // €50 pour l'abonnement PRO

  APPEARANCE: {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#f97316", // Orange-500 pour correspondre au design
    },
  },

  CONFIRM_PARAMS: {
    return_url: `${window.location.origin}/payment/success`,
  },
} as const;

// Messages d'erreur standardisés
export const STRIPE_ERRORS = {
  PAYMENT_FAILED: "Erreur lors du paiement",
  UNEXPECTED_ERROR: "Erreur inattendue lors du paiement",
  MISSING_ELEMENTS: "Éléments de paiement non chargés",
} as const;
