import { useEffect } from 'react';
import { useKeycloakContext } from '../../services/useKeycloakContext';

const Login = () => {
  const { keycloak } = useKeycloakContext();

  useEffect(() => {
    if (!keycloak.authenticated) {
      keycloak.login();
    }
  }, []);

  return (
    <div>
      <p>Redirection vers la page de connexion... LOADER</p>
    </div>
  );
};

export default Login;