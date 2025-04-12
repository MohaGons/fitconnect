import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Dashboard from "../pages/dashboard/dashboard";
import ProtectedRoute from "./protectedRoute";

const App = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
  );
};

export default App;
