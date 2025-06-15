import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import NotFound from "./pages/OtherPage/NotFound";
import Calendar from "./pages/Calendar/Calendar";
import Chat from "./pages/Chat/Chat";
import Nutrition from "./pages/Nutrition/Nutrition";
import Programs from "./pages/Programs/Programs";
import Users from "./pages/Users/Users";
import Customers from "./pages/Customers/Customers";
import Invoices from "./pages/Invoices/Invoices";
import Exerecices from "./pages/Exercices/Exerecices";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
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

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
