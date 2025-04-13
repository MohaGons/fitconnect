import { useKeycloakContext } from '../services/useKeycloakContext';
import sportImage from '../assets/home.jpg';

const Home = () => {
  const { keycloak } = useKeycloakContext();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-800">MonApp</div>
        <div className="space-x-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100" onClick={() => keycloak.login()}>
            Login
          </button>
          {!keycloak?.authenticated && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => keycloak.register()}>
            Register
          </button>
            )}
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative flex-1 bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${sportImage})`, 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div> 
        <h1 className="relative z-10 text-3xl md:text-5xl font-bold text-white bg-black/50 px-4 py-2 rounded-xl">
          Logiciel complet pour coach sportif
        </h1>
        
       

      </div>
    </div>
  );
};

export default Home;
