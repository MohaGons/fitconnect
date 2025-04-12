import React, { createContext, useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

// Créez un objet de contexte stable
const contextValue = { keycloak };
export const KeycloakContext = createContext(contextValue);

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initCalled = useRef(false);

  useEffect(() => {
    // Utilisez useRef pour s'assurer que init n'est appelé qu'une seule fois
    if (!initialized && !initCalled.current) {
      initCalled.current = true;
      keycloak
        .init({ onLoad: 'login-required' })
        .then((authenticated) => {
          setIsAuthenticated(authenticated);
          setInitialized(true);
        })
        .catch((err) => {
          console.error('Keycloak init failed:', err);
        });
    }
  }, [initialized]);

  return (
    <KeycloakContext.Provider value={contextValue}>
      {initialized && isAuthenticated ? children : <div>Loading...</div>}
    </KeycloakContext.Provider>
  );
};