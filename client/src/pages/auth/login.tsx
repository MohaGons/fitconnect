import { useKeycloakContext } from '../../services/useKeycloakContext';

const Login = () => {
  const { keycloak } = useKeycloakContext();

  return (
    <div>
      <h1>Login</h1>
       <button onClick={() => keycloak.login()}>Se connecter</button>  
    </div>
  );
};

export default Login;