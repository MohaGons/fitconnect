import React, { createContext, useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';
import { useLocation } from 'react-router-dom';
import Login from '../pages/auth/login';

// Créez un objet de contexte avec plus d'informations
const contextValue = { 
  keycloak,
  initialized: false,
  isAuthenticated: false 
};
export const KeycloakContext = createContext(contextValue);

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/welcome','/our-team','/prices','/faq','/services', '/login', '/signin', '/register', '/signup', '/about', '/contact'];


export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initCalled = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (keycloak.didInitialize) { 
      return
    }
    if (!initialized && !initCalled.current) {
      initCalled.current = true;
      keycloak
        .init({ 
          onLoad: 'check-sso',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri: 'https://fitnessconnect.fr/silent-check-sso.html',
          redirectUri: 'https://fitnessconnect.fr/dashboard/home',
        })
        .then((authenticated) => {
          console.log('Keycloak initialized:', authenticated);
          setIsAuthenticated(authenticated);
          setInitialized(true);
        })
        .catch((err) => {
          console.error('Keycloak init failed:', err);
        });
    }
  }, []);

  // Mise à jour de la valeur du contexte avec l'état actuel
  const currentContextValue = {
    keycloak,
    initialized,
    isAuthenticated
  };

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!initialized) {
    return (
      <div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={currentContextValue}>
      {isPublicRoute || isAuthenticated ? children : <Login/>}
    </KeycloakContext.Provider>
  );
};