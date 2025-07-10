import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignUp from "./pages/public/AuthPages/SignUp";

import { KeycloakProvider } from './services/keycloakContext';
import AppLayout from "./layout/admin/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/admin/dashboard/Home";
import NotFound from "./pages/admin/OtherPage/NotFound";
import Calendar from "./pages/admin/Calendar/Calendar";
import Chat from "./pages/admin/Chat";
import Nutrition from "./pages/admin/Nutrition/Nutrition";
import Programs from "./pages/admin/Programs/Programs";
import Users from "./pages/admin/Users/Users";
import Customers from "./pages/admin/Customers/Customers";
import Invoices from "./pages/admin/Invoices/Invoices";
import Exerecices from "./pages/admin/Exercices/Exerecices";
import ProtectedRoute from "./routes/protectedRoute";
import InscriptionPage from "./pages/admin/inscription/inscription";
import SignIn from "./pages/public/AuthPages/SignIn";
import PrivacyPolicy from "./pages/public/PrivacyPolicy/PrivacyPolicy";
import Welcome from "./pages/public/Welcome/Welcome";

// Cookie Consent Components
import { CookieConsentProvider } from './context/CookieConsentContext';
import CookieBanner from './components/privacy/CookieBanner';

// Déclaration des types pour Matomo
declare global {
  interface Window {
    _mtm: Array<Record<string, string | number>>;
  }
}

export default function App() {
  React.useEffect(() => {
    const _mtm = window._mtm = window._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = 'https://cdn.matomo.cloud/fitnessconnect.matomo.cloud/container_kHUYHHcx.js';
    if (s.parentNode) {
      s.parentNode.insertBefore(g, s);
    }
  }, []);

  return (
    <>
      <Router>
        <CookieConsentProvider>
          <KeycloakProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route index path="/" element={<Welcome />} />
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
