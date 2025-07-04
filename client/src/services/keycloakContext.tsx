import React, { createContext, useEffect, useState, useRef } from "react";
import keycloak from "./keycloak";
import { useLocation } from "react-router-dom";
import Login from "../pages/auth/login";
import { useCookieConsent } from "../context/CookieConsentContext";

// Créez un objet de contexte avec plus d'informations
const contextValue = {
  keycloak,
  initialized: false,
  isAuthenticated: false,
};
export const KeycloakContext = createContext(contextValue);

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/",
  "/welcome",
  "/our-team",
  "/prices",
  "/faq",
  "/services",
  "/cgu",
  "/cgv",
  "/privacy-policy",
  "/login",
  "/signin",
  "/register",
  "/signup",
  "/about",
  "/contact",
];

export const KeycloakProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initCalled = useRef(false);
  const location = useLocation();

  // Utilisation optionnelle du contexte cookies (peut ne pas être disponible lors de l'initialisation)
  let consent;
  try {
    consent = useCookieConsent().consent;
  } catch (error) {
    // Si le contexte n'est pas disponible, utiliser des valeurs par défaut
    consent = {
      hasConsented: false,
      categories: {
        essential: true, // Par défaut, autoriser les cookies essentiels
        analytics: false,
        marketing: false,
        preferences: false,
      },
    };
  }

  useEffect(() => {
    if (keycloak.didInitialize) {
      return;
    }

    // Ne pas initialiser Keycloak si les cookies essentiels sont explicitement refusés
    if (consent.hasConsented && !consent.categories.essential) {
      console.log(
        "Keycloak initialization blocked: essential cookies not accepted"
      );
      setInitialized(true); // Marquer comme initialisé mais non authentifié
      return;
    }

    if (!initialized && !initCalled.current) {
      initCalled.current = true;

      // Configuration Keycloak adaptée au consentement des cookies
      const keycloakConfig = {
        onLoad: consent.categories.essential
          ? ("check-sso" as const)
          : ("login-required" as const),
        silentCheckSsoRedirectUri: consent.categories.essential
          ? window.location.origin + "/silent-check-sso.html"
          : undefined,
        redirectUri: "http://localhost:5173/dashboard/home",
        // Désactiver les cookies de session si pas de consentement
        enableLogging: process.env.NODE_ENV === "development",
      };

      keycloak
        .init(keycloakConfig)
        .then((authenticated) => {
          console.log("Keycloak initialized:", authenticated);
          setIsAuthenticated(authenticated);
          setInitialized(true);
        })
        .catch((err) => {
          console.error("Keycloak init failed:", err);
          setInitialized(true); // Marquer comme initialisé même en cas d'erreur
        });
    }
  }, [consent?.categories?.essential, consent?.hasConsented]);

  // Mise à jour de la valeur du contexte avec l'état actuel
  const currentContextValue = {
    keycloak,
    initialized,
    isAuthenticated,
  };

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!initialized) {
    return <div></div>;
  }

  return (
    <KeycloakContext.Provider value={currentContextValue}>
      {isPublicRoute || isAuthenticated ? children : <Login />}
    </KeycloakContext.Provider>
  );
};
