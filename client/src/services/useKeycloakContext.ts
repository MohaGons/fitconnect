// useKeycloakContext.ts
import { useContext } from 'react';
import { KeycloakContext } from './keycloakContext';

export const useKeycloakContext = () => {
  return useContext(KeycloakContext);
};