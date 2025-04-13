import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import '../index.css';
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Dashboard from "../pages/dashboard/dashboard";
import Coach from "../pages/coach/coach";
import ProtectedRoute from "./protectedRoute";
import Home from "../pages/home";
import { KeycloakProvider } from '../services/keycloakContext';

const App = () => {
  return (
    
      <Router>
            <KeycloakProvider>
        <Routes>
          {/* public routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protected routes here */}
          <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/coach" element={<Coach />} />
          </Route>
        </Routes>
        </KeycloakProvider>
      </Router>
  );
};

export default App;
