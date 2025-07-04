import React, { useState, useEffect } from "react";
import { X, Settings, Cookie, Shield, BarChart3, Heart } from "lucide-react";
import { useCookieConsent } from "../../context/CookieConsentContext";
import CookieManager from "./CookieManager";

const CookieBanner: React.FC = () => {
  const { consent, acceptAll, rejectAll, hideBanner } = useCookieConsent();
  const [showManager, setShowManager] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    if (consent.bannerVisible) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [consent.bannerVisible]);

  // Ne pas afficher si pas nécessaire
  if (!consent.bannerVisible) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
    setTimeout(hideBanner, 300);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
    setTimeout(hideBanner, 300);
  };

  const handleOpenManager = () => {
    setShowManager(true);
  };

  const handleCloseManager = () => {
    setShowManager(false);
    setIsVisible(false);
    setTimeout(hideBanner, 300);
  };

  return (
    <>
      {/* Overlay gris qui bloque les interactions */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-[9998] ${
          isVisible ? "bg-gray-900/40 pointer-events-auto" : "bg-transparent pointer-events-none"
        }`}
      />

      {/* Bannière principale */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-300 ease-out ${
          isVisible ? "transform translate-y-0" : "transform translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between gap-6">
              {/* Icône et contenu principal */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-orange-600" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Nous utilisons des cookies
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience,
                    analyser l'utilisation de notre site et personnaliser le
                    contenu. Vous pouvez accepter tous les cookies ou gérer vos
                    préférences en détail.
                  </p>

                  {/* Aperçu des catégories */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Shield className="w-3 h-3 text-green-600" />
                      <span>Essentiels</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <BarChart3 className="w-3 h-3 text-blue-600" />
                      <span>Analytiques</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Heart className="w-3 h-3 text-purple-600" />
                      <span>Préférences</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Bouton fermer (mobile) */}
                  <button
                    onClick={handleRejectAll}
                    className="sm:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Boutons d'action principaux */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleOpenManager}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Gérer</span>
                    </button>

                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      Refuser
                    </button>

                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                      Accepter tous
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Liens informatifs */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <a
                  href="/privacy-policy"
                  className="hover:text-orange-600 underline transition-colors"
                >
                  Politique de confidentialité
                </a>
                <a
                  href="/cgu"
                  className="hover:text-orange-600 underline transition-colors"
                >
                  Conditions d'utilisation
                </a>
                <span className="hidden sm:inline">
                  En continuant, vous acceptez notre utilisation des cookies
                  essentiels.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestionnaire de cookies modal */}
      {showManager && (
        <CookieManager isOpen={showManager} onClose={handleCloseManager} />
      )}
    </>
  );
};

export default CookieBanner;
