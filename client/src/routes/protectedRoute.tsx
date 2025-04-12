// protectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useKeycloakContext } from '../services/useKeycloakContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { keycloak } = useKeycloakContext();

  if (!keycloak.authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;