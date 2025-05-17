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

export default function App() {
  return (
    <>
      <Router>
      <KeycloakProvider>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
           <Route index path="/" element={<FrontHome />} />
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
          <Route element={<ProtectedRoute />}>
            <Route path="/inscription" element={<InscriptionPage />} />
          </Route>
          {/* Auth Layout */}
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </KeycloakProvider>
      </Router>
    </>
  );
}
