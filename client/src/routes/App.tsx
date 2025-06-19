import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../index.css";

// Context & Services
import { KeycloakProvider } from "../services/keycloakContext";

// Layouts
import AppLayout from "../layout/admin/AppLayout";

// Components
import { ScrollToTop } from "../components/common/ScrollToTop";
import ProtectedRoute from "../routes/protectedRoute";

// Pages d'Authentification
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import SignUp from "../pages/public/AuthPages/SignUp";

// Pages Admin - Dashboard
import Dashboard from "../pages/admin/dashboard/dashboard";
import AdminHome from "../pages/admin/dashboard/Home";

// Pages Admin - Gestion
import Users from "../pages/admin/Users/Users";
import Customers from "../pages/admin/Customers/Customers";
import Coach from "../pages/admin/coach/coach";
import Coaches from "../pages/admin/Coaches/Coaches";

// Pages Admin - Planning & Communication
import Calendar from "../pages/admin/Calendar/Calendar";

// Pages Admin - Services
import Nutrition from "../pages/admin/Nutrition/Nutrition";
import Meals from "../pages/admin/Meals/Meals";
import Ingredients from "../pages/admin/Ingredients/Ingredients";
import Programs from "../pages/admin/Programs/Programs";
import Exercises from "../pages/admin/Exercices/Exerecices";

// Pages Admin - Finances
import Invoices from "../pages/admin/Invoices/Invoices";
import Payment from "../pages/admin/payment/Payment";

// Pages Admin - Autres
import InscriptionPage from "../pages/admin/inscription/inscription";
import NotFound from "../pages/admin/OtherPage/NotFound";
import Welcome from "../pages/public/Welcome/Welcome";
import PublicLayout from "../layout/public/PublicLayout";
import OurTeam from "../pages/public/OurTeams/OurTeam";
import Prices from "../pages/public/Prices/Prices";
import Faq from "../pages/public/Faq/Faq";
import Services from "../pages/public/Services/Services";
import Cgu from "../pages/public/Cgu/Cgu";
import Cgv from "../pages/public/Cgv/Cgv";
import Contact from "../pages/public/Contact/Contact";
import Chat from "../pages/admin/Chat";

const App = () => {
  return (
    <Router>
      <KeycloakProvider>
        <ScrollToTop />
        <Routes>
          {/* ==================== ROUTES PUBLIQUES ==================== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/services" element={<Services />} />
            <Route path="/cgu" element={<Cgu />} />
            <Route path="/cgv" element={<Cgv />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          {/* ==================== ROUTES D'AUTHENTIFICATION ==================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />{" "}
          {/* Alias pour compatibilité */}
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<SignUp />} />
          {/* ==================== ROUTES ADMIN PROTÉGÉES ==================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Dashboard Principal */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/home" element={<AdminHome />} />

              {/* Gestion des Utilisateurs */}
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/customers" element={<Customers />} />
              <Route path="/dashboard/coaches" element={<Coaches />} />
              <Route path="/coach" element={<Coach />} />

              {/* Planning & Communication */}
              <Route path="/dashboard/calendar" element={<Calendar />} />
              <Route path="/dashboard/chat" element={<Chat />} />

              {/* Services */}
              <Route path="/dashboard/nutrition" element={<Nutrition />} />
              <Route path="/dashboard/meals" element={<Meals />} />
              <Route path="/dashboard/ingredients" element={<Ingredients />} />
              <Route path="/dashboard/programs" element={<Programs />} />
              <Route path="/dashboard/exercises" element={<Exercises />} />

              {/* Finances */}
              <Route path="/dashboard/invoices" element={<Invoices />} />
              <Route path="/dashboard/payment" element={<Payment />} />

              {/* Autres */}
            </Route>
            <Route path="/inscription" element={<InscriptionPage />} />
          </Route>
          {/* ==================== ROUTE 404 ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </KeycloakProvider>
    </Router>
  );
};

export default App;
