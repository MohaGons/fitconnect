import { useKeycloakContext } from '../../services/useKeycloakContext';

const Register = () => {
  const { keycloak } = useKeycloakContext();

  return (
    <div>
      <h1>Register</h1>
      <button onClick={() => keycloak.register()}>Créer un compte</button>
    </div>
  );
};

export default Register;