import { useEffect, useState } from 'react';
import { useKeycloakContext } from '../services/useKeycloakContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { keycloak, initialized } = useKeycloakContext();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
  if (!initialized) return;

  if (!keycloak?.authenticated) {
    setRedirectPath('/login');
    setChecking(false);
    return;
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  if (roles.includes('ADMIN')) {
    setRedirectPath('/admin-profile');
  } else if (!roles.includes('COACH') && !roles.includes('CLIENT')) {
    if (location.pathname !== '/inscription') {
      setRedirectPath('/inscription');
    } else {
      setRedirectPath(null); // évite la boucle
    }
  }

  setChecking(false);
}, [initialized, keycloak?.authenticated, location.pathname]);



  if (checking || !initialized) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
