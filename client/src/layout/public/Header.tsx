import React, { useState } from "react";
import { Menu, X, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import keycloak from "../../services/keycloak";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Notre équipe", href: "/our-team" },
    { name: "Tarifs", href: "/prices" },
    { name: "Faq", href: "/faq" },
    { name: "Services", href: "/services" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(false);
  };

  const clipPathStyle = {
    clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 100%, 15px 100%)",
  };

  return (
    <>
      {/* Top Bar - Fully Responsive */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 sm:h-10 flex items-center">
            {/* Mobile View */}
            <div className="flex md:hidden items-center justify-between w-full text-xs">
              <a
                href="tel:+10234621050"
                className="flex items-center space-x-1 hover:text-orange-400 transition-colors"
              >
                <Phone className="w-3 h-3 text-orange-400" />
                <span>Appelez-nous</span>
              </a>
              <div className="flex items-center space-x-3">
                <a
                  href="mailto:info@fitconnect.com"
                  className="hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-400" />
                </a>
                <span className="text-orange-400">•</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 text-orange-400 mr-1" />
                  8h-20h
                </span>
              </div>
            </div>

            {/* Tablet View (sm to md) */}
            <div className="hidden sm:flex md:hidden items-center justify-between w-full text-sm">
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:info@fitconnect.com"
                  className="flex items-center space-x-1 hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>info@fitconnect.com</span>
                </a>
                <span className="text-gray-600">|</span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 text-orange-400 mr-1" />
                  8h00 - 20h00
                </span>
              </div>
              <a
                href="tel:+10234621050"
                className="flex items-center space-x-1 hover:text-orange-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="font-medium">+10-(234)621050</span>
              </a>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between w-full text-sm">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <a
                  href="mailto:info@fitconnect.com"
                  className="flex items-center space-x-2 hover:text-orange-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>info@fitconnect.com</span>
                </a>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Paris, France</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Lun-Ven: 08h00 - 20h00</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="tel:+10234621050"
                  className="flex items-center space-x-2 hover:text-orange-400 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">+10-(234)621050</span>
                </a>
                <div className="flex items-center space-x-3 text-xs">
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="fixed top-8 sm:top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg z-40"
        style={{ ...clipPathStyle, width: "90%", maxWidth: "1200px" }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/images/logo/logo.png"
                  alt="FitConnect"
                  className="h-8 sm:h-10"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6 lg:space-x-8">
                {navItems.map((item) => (
                  <li key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      onClick={handleMenuClick}
                      className={`flex items-center transition-all duration-200 py-2 font-medium ${
                        isActiveLink(item.href)
                          ? "text-orange-500"
                          : "text-gray-700 hover:text-orange-500"
                      }`}
                    >
                      {item.name}
                    </Link>
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                        isActiveLink(item.href) ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Icon - Hidden on mobile */}
              <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Auth Buttons */}
              <button
                onClick={() => keycloak.login()}
                className="hidden md:flex items-center text-gray-700 hover:text-orange-500 transition-colors font-medium"
              >
                <span>Connexion</span>
              </button>

              <button
                onClick={() => keycloak.register()}
                className="bg-orange-500 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base relative overflow-hidden hover:bg-orange-600 transition-all duration-200 cursor-pointer transform hover:scale-105"
                style={clipPathStyle}
              >
                <span className="hidden sm:inline">Inscription</span>
                <span className="sm:hidden">S'inscrire</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleMenuClick}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => keycloak.login()}
                    className="block w-full text-center px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => keycloak.register()}
                    className="block w-full text-center bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition-colors duration-200"
                  >
                    Inscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
