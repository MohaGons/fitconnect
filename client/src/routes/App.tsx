import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../index.css";

// Context & Services
import { KeycloakProvider } from "../services/keycloakContext";

// Layouts
import AppLayout from "../layout/admin/AppLayout";

// Components
import { ScrollToTop } from "../components/common/ScrollToTop";
import ProtectedRoute from "../routes/protectedRoute";
import RoleBasedRoute from "../routes/RoleBasedRoute"; // Nouveau composant à créer

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
import Payment from "../pages/admin/Payment/Payment";

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
import PrivacyPolicy from "../pages/public/PrivacyPolicy/PrivacyPolicy";
import Chat from "../pages/admin/Chat";
import Profile from "../pages/admin/profile/profile";

// Cookie Consent Components
import { CookieConsentProvider } from "../context/CookieConsentContext";
import CookieBanner from "../components/privacy/CookieBanner";

const App = () => {
  return (
    <Router>
      <CookieConsentProvider>
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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* ==================== ROUTES D'AUTHENTIFICATION ==================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<SignUp />} />

            {/* ==================== ROUTES ADMIN PROTÉGÉES ==================== */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Dashboard Principal - Accessible à tous */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/home" element={<AdminHome />} />

                {/* Profil - Accessible à tous */}
                <Route path="/dashboard/profile" element={<Profile />} />

                {/* ================ ROUTES SPÉCIFIQUES AUX COACHES ================ */}

                {/* Paiement - Coaches seulement */}
                <Route
                  path="/dashboard/payment"
                  element={
                    <RoleBasedRoute allowedRoles={["COACH"]}>
                      <Payment />
                    </RoleBasedRoute>
                  }
                />

                {/* Gestion des utilisateurs - Coaches seulement */}
                <Route
                  path="/dashboard/all-coaches"
                  element={
                    <RoleBasedRoute allowedRoles={["ADMIN"]}>
                      <Coach />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/all-clients"
                  element={
                    <RoleBasedRoute allowedRoles={["ADMIN"]}>
                      <Users />
                    </RoleBasedRoute>
                  }
                />

                {/* Gestion des clients/coaches selon le rôle */}
                <Route
                  path="/dashboard/customers"
                  element={
                    <RoleBasedRoute allowedRoles={["COACH","ADMIN"] }>
                      <Customers />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/coaches"
                  element={
                    <RoleBasedRoute allowedRoles={["CLIENT","ADMIN"]}>
                      <Coaches />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/coach"
                  element={
                    <RoleBasedRoute allowedRoles={["ADMIN"]}>
                      <Coach />
                    </RoleBasedRoute>
                  }
                />

                {/* Planning & Communication */}
                <Route
                  path="/dashboard/calendar"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "CLIENT"]}
                      requireSubscription={true}
                    >
                      <Calendar />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/chat"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "CLIENT"]}
                      requireSubscription={true}
                    >
                      <Chat />
                    </RoleBasedRoute>
                  }
                />

                {/* Services - Avec contrôle d'abonnement pour les coaches */}
                <Route
                  path="/dashboard/nutrition"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "ADMIN"]}
                      requireSubscription={true}
                    >
                      <Nutrition />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/meals"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "ADMIN"]}
                      requireSubscription={true}
                    >
                      <Meals />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/ingredients"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "ADMIN"]}
                      requireSubscription={true}
                    >
                      <Ingredients />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/programs"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH"]}
                      requireSubscription={true}
                    >
                      <Programs />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard/exercises"
                  element={
                    <RoleBasedRoute
                      allowedRoles={["COACH", "CLIENT"]}
                      requireSubscription={true}
                    >
                      <Exercises />
                    </RoleBasedRoute>
                  }
                />
               
              </Route>
              <Route path="/inscription" element={<InscriptionPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Cookie Banner - Global */}
          <CookieBanner />
        </KeycloakProvider>
      </CookieConsentProvider>
    </Router>
  );
};

export default App;
