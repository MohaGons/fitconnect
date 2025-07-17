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
    if (!initialized && !initCalled.current) {
      initCalled.current = true;

      keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          redirectUri: 'https://fitnessconnect.fr/dashboard/home',
        })
        .then(authenticated => {
          console.log('✅ Keycloak initialized:', authenticated);
          setIsAuthenticated(authenticated);
          setInitialized(true);
        })
        .catch(err => {
          console.error('❌ Keycloak init failed:', err);
          setInitialized(true); // On ne bloque pas l’app si init échoue
        });
    }
  }, [consent?.categories?.essential, consent?.hasConsented]);

  // ✅ Normalisation du chemin
  const normalizePath = (path: string) => path.replace(/\/+$/, '');
  const isPublicRoute = publicRoutes.some(route =>
    normalizePath(location.pathname).startsWith(normalizePath(route))
  );

  console.log('Path:', location.pathname, '| Public:', isPublicRoute, '| Init:', initialized, '| Auth:', isAuthenticated);

  // ✅ Bloquer le rendu uniquement pendant init
  if (!initialized) {
    return null; // ou un spinner
  }

  // ✅ Rendu sécurisé après init
  return (
    <KeycloakContext.Provider value={{ keycloak, initialized, isAuthenticated }}>
      {isPublicRoute || isAuthenticated ? children : <Login />}
    </KeycloakContext.Provider>
  );
};
