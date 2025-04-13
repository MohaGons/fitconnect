import { useKeycloakContext } from '../../services/useKeycloakContext';

const Dashboard = () => {
  const { keycloak } = useKeycloakContext(); // Récupère le contexte de Keycloak

  // Vérifie si le token existe
  const token = keycloak?.token;
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/', 
    });
  };
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      {token ? (
        <div>
          <h2>Your Token: </h2>
          <pre>{token}</pre> 
          <button className="px-4 py-2 border rounded-lg bg-red-500" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading token...</p> 
      )}
    </div>
  );
};

export default Dashboard;
