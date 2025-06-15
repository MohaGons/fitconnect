import { useKeycloakContext } from '../services/useKeycloakContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { keycloak } = useKeycloakContext();
  
  if (!keycloak.authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
