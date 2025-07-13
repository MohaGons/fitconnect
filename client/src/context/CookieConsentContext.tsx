import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types pour les différentes catégories de cookies
export interface CookieCategories {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Interface pour l'état du consentement
export interface CookieConsentState {
  hasConsented: boolean;
  consentDate: string | null;
  categories: CookieCategories;
  bannerVisible: boolean;
}

// Interface pour le contexte
export interface CookieConsentContextType {
  consent: CookieConsentState;
  acceptAll: () => void;
  rejectAll: () => void;
  updateCategories: (categories: Partial<CookieCategories>) => void;
  resetConsent: () => void;
  showBanner: () => void;
  hideBanner: () => void;
  isConsentRequired: () => boolean;
}

// État initial
const initialState: CookieConsentState = {
  hasConsented: false,
  consentDate: null,
  categories: {
    essential: true, // Toujours requis
    analytics: false,
    marketing: false,
    preferences: false,
  },
  bannerVisible: false,
};

// Clé pour le localStorage
const STORAGE_KEY = "fitconnect_cookie_consent";
const CONSENT_DURATION_DAYS = 365; // Durée de validité du consentement

// Création du contexte
const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

// Provider
export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<CookieConsentState>(initialState);

  // Charger le consentement depuis le localStorage au démarrage
  useEffect(() => {
    loadConsentFromStorage();
  }, []);

  // Sauvegarder le consentement dans le localStorage
  useEffect(() => {
    if (consent.hasConsented) {
      saveConsentToStorage(consent);
    }
  }, [consent]);

  const loadConsentFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedConsent: CookieConsentState = JSON.parse(stored);

        // Vérifier si le consentement n'a pas expiré
        if (parsedConsent.consentDate) {
          const consentDate = new Date(parsedConsent.consentDate);
          const now = new Date();
          const daysDiff =
            (now.getTime() - consentDate.getTime()) / (1000 * 3600 * 24);

          if (daysDiff <= CONSENT_DURATION_DAYS) {
            setConsent({
              ...parsedConsent,
              bannerVisible: false, // Ne pas afficher la bannière si déjà consenti
            });
            return;
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement du consentement cookies:",
        error
      );
    }

    // Si pas de consentement valide, afficher la bannière
    setConsent((prev) => ({ ...prev, bannerVisible: true }));
  };

  const saveConsentToStorage = (consentData: CookieConsentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde du consentement cookies:",
        error
      );
    }
  };

  const acceptAll = () => {
    const newConsent: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      categories: {
        essential: true,
        analytics: true,
        marketing: true,
        preferences: true,
      },
      bannerVisible: false,
    };
    setConsent(newConsent);

    // Trigger event pour informer les autres composants
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", {
        detail: newConsent.categories,
      })
    );
  };

  const rejectAll = () => {
    const newConsent: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      categories: {
        essential: true, // Toujours requis
        analytics: false,
        marketing: false,
        preferences: false,
      },
      bannerVisible: false,
    };
    setConsent(newConsent);

    // Nettoyer les cookies non-essentiels
    cleanupNonEssentialCookies();

    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", {
        detail: newConsent.categories,
      })
    );
  };

  const updateCategories = (newCategories: Partial<CookieCategories>) => {
    const updatedConsent: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      categories: {
        ...consent.categories,
        essential: true, // Toujours requis
        ...newCategories,
      },
      bannerVisible: false,
    };
    setConsent(updatedConsent);

    // Nettoyer les cookies des catégories désactivées
    Object.entries(newCategories).forEach(([category, enabled]) => {
      if (!enabled && category !== "essential") {
        cleanupCookieCategory(category as keyof CookieCategories);
      }
    });

    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", {
        detail: updatedConsent.categories,
      })
    );
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent({ ...initialState, bannerVisible: true });
    cleanupNonEssentialCookies();
  };

  const showBanner = () => {
    setConsent((prev) => ({ ...prev, bannerVisible: true }));
  };

  const hideBanner = () => {
    setConsent((prev) => ({ ...prev, bannerVisible: false }));
  };

  const isConsentRequired = () => {
    return !consent.hasConsented || consent.bannerVisible;
  };

  // Fonction pour nettoyer les cookies non-essentiels
  const cleanupNonEssentialCookies = () => {
    // Liste des cookies à préserver (essentiels)
    const essentialCookies = [
      "KEYCLOAK_SESSION",
      "KEYCLOAK_IDENTITY",
      "KEYCLOAK_LOCALE",
      "JSESSIONID",
      "fitconnect_cookie_consent",
    ];

    // Supprimer tous les autres cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

      if (!essentialCookies.some((essential) => name.includes(essential))) {
        // Supprimer le cookie en définissant une date d'expiration passée
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });

    // Nettoyer le localStorage (sauf le consentement et les données essentielles)
    const essentialStorage = ["fitconnect_cookie_consent", "theme"];
    Object.keys(localStorage).forEach((key) => {
      if (!essentialStorage.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  };

  const cleanupCookieCategory = (category: keyof CookieCategories) => {
    switch (category) {
      case "analytics":
        // Supprimer les cookies Google Analytics, etc.
        ["_ga", "_gid", "_gat", "_gtag"].forEach((name) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        break;
      case "marketing":
        // Supprimer les cookies de marketing/publicité
        ["_fbp", "_fbc", "fr"].forEach((name) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        break;
      case "preferences":
        // Nettoyer les préférences non-essentielles
        localStorage.removeItem("user_preferences");
        break;
    }
  };

  const contextValue: CookieConsentContextType = {
    consent,
    acceptAll,
    rejectAll,
    updateCategories,
    resetConsent,
    showBanner,
    hideBanner,
    isConsentRequired,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};

// Hook pour vérifier si une catégorie de cookies est autorisée
export const useCookieCategory = (
  category: keyof CookieCategories
): boolean => {
  const { consent } = useCookieConsent();
  return consent.categories[category];
};

export default CookieConsentContext;
