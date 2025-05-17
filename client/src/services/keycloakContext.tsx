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
const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];

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
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          redirectUri: 'http://localhost:5173/dashboard/home',
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
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  if (!initialized) {
    return ;
  }

  return (
    <KeycloakContext.Provider value={currentContextValue}>
      {isPublicRoute || isAuthenticated ? children : <Login/>}
    </KeycloakContext.Provider>
  );
};