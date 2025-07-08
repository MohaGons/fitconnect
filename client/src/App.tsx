import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
//import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import { KeycloakProvider } from './services/keycloakContext';
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/dashboard/Home";
import FrontHome from "./pages/home";
import NotFound from "./pages/OtherPage/NotFound";
import Calendar from "./pages/Calendar/Calendar";
import Chat from "./pages/Chat/Chat";
import Nutrition from "./pages/Nutrition/Nutrition";
import Programs from "./pages/Programs/Programs";
import Users from "./pages/Users/Users";
import Customers from "./pages/Customers/Customers";
import Invoices from "./pages/Invoices/Invoices";
import Exerecices from "./pages/Exercices/Exerecices";
import Login from "./pages/auth/login"
import ProtectedRoute from "./routes/protectedRoute";
import InscriptionPage from "./pages/inscription/inscription";
import SignIn from "./pages/AuthPages/SignIn";
import PrivacyPolicy from "./pages/public/PrivacyPolicy/PrivacyPolicy";

// Cookie Consent Components
import { CookieConsentProvider } from './context/CookieConsentContext';
import CookieBanner from './components/privacy/CookieBanner';

export default function App() {
  React.useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://cdn.matomo.cloud/fitnessconnect.matomo.cloud/container_kHUYHHcx.js'; s.parentNode.insertBefore(g,s);
  }, []);

  return (
    <>
      <Router>
        <CookieConsentProvider>
          <KeycloakProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route index path="/" element={<FrontHome />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* Dashboard Layout */}
              <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard/home" element={<Home />} />
                  <Route path="/dashboard/users" element={<Users />} />
                  <Route path="/dashboard/customers" element={<Customers />} />
                  <Route path="/dashboard/calendar" element={<Calendar/>} />
                  <Route path="/dashboard/chat" element={<Chat />} />
                  <Route path="/dashboard/nutrition" element={<Nutrition />} />
                  <Route path="/dashboard/invoices" element={<Invoices />} />
                  <Route path="/dashboard/programs" element={<Programs />} />
                  <Route path="/dashboard/exercises" element={<Exerecices />} />
                </Route>
              </Route>
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/inscription" element={<InscriptionPage />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Cookie Banner - Global */}
            <CookieBanner />
          </KeycloakProvider>
        </CookieConsentProvider>
      </Router>
    </>
  );
}
