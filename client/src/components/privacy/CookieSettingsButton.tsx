import React, { useState } from "react";
import { Cookie, Settings } from "lucide-react";
import { useCookieConsent } from "../../context/CookieConsentContext";
import CookieManager from "./CookieManager";

interface CookieSettingsButtonProps {
  variant?: "icon" | "text" | "full";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({
  variant = "full",
  className = "",
  size = "md",
}) => {
  const [showManager, setShowManager] = useState(false);
  const { consent } = useCookieConsent();

  const handleOpenManager = () => {
    setShowManager(true);
  };

  const handleCloseManager = () => {
    setShowManager(false);
  };

  // Déterminer les classes CSS selon la taille
  const sizeClasses = {
    sm: {
      button: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
      gap: "gap-1",
    },
    md: {
      button: "px-3 py-2 text-sm",
      icon: "w-4 h-4",
      gap: "gap-2",
    },
    lg: {
      button: "px-4 py-2 text-base",
      icon: "w-5 h-5",
      gap: "gap-2",
    },
  };

  const classes = sizeClasses[size];

  // Classes de base du bouton
  const baseClasses = `
    inline-flex items-center justify-center
    text-gray-600 hover:text-orange-600
    transition-colors duration-200
    rounded-lg
    ${classes.button}
    ${classes.gap}
    ${className}
  `;

  const renderContent = () => {
    switch (variant) {
      case "icon":
        return <Settings className={classes.icon} />;

      case "text":
        return <span>Paramètres des cookies</span>;

      case "full":
      default:
        return (
          <>
            <Cookie className={classes.icon} />
            <span>Paramètres des cookies</span>
          </>
        );
    }
  };

  // Indicateur de statut du consentement
  const getStatusIndicator = () => {
    if (!consent.hasConsented) {
      return (
        <span
          className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1"
          title="Consentement requis"
        />
      );
    }

    const totalCategories = 4; // essential, analytics, marketing, preferences
    const acceptedCategories = Object.values(consent.categories).filter(
      Boolean
    ).length;

    if (acceptedCategories === totalCategories) {
      return (
        <span
          className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"
          title="Tous les cookies acceptés"
        />
      );
    } else if (acceptedCategories === 1) {
      // Seulement les essentiels
      return (
        <span
          className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-1"
          title="Cookies essentiels uniquement"
        />
      );
    } else {
      return (
        <span
          className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-1"
          title="Cookies partiellement acceptés"
        />
      );
    }
  };

  return (
    <>
      <button
        onClick={handleOpenManager}
        className={baseClasses}
        title="Gérer les préférences de cookies"
        aria-label="Ouvrir les paramètres de cookies"
      >
        {renderContent()}
        {variant !== "icon" && getStatusIndicator()}
      </button>

      {/* Modal de gestion des cookies */}
      {showManager && (
        <CookieManager isOpen={showManager} onClose={handleCloseManager} />
      )}
    </>
  );
};

export default CookieSettingsButton;
