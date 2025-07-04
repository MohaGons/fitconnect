import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  BarChart3,
  Heart,
  Target,
  Cookie,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useCookieConsent,
  CookieCategories,
} from "../../context/CookieConsentContext";
import { CookieService, COOKIE_CATALOG } from "../../services/cookieService";

interface CookieManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookieManager: React.FC<CookieManagerProps> = ({ isOpen, onClose }) => {
  const { consent, updateCategories } = useCookieConsent();
  const [localCategories, setLocalCategories] = useState<CookieCategories>(
    consent.categories
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setLocalCategories(consent.categories);
  }, [consent.categories]);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Empêcher le scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleCategoryChange = (
    category: keyof CookieCategories,
    enabled: boolean
  ) => {
    if (category === "essential") return; // Les cookies essentiels ne peuvent pas être désactivés

    setLocalCategories((prev) => ({
      ...prev,
      [category]: enabled,
    }));
  };

  const handleSavePreferences = () => {
    updateCategories(localCategories);
    onClose();
  };

  const handleAcceptAll = () => {
    const allEnabled: CookieCategories = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setLocalCategories(allEnabled);
    updateCategories(allEnabled);
    onClose();
  };

  const handleRejectAll = () => {
    const onlyEssential: CookieCategories = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setLocalCategories(onlyEssential);
    updateCategories(onlyEssential);
    onClose();
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const categoryInfo = {
    essential: {
      icon: Shield,
      title: "Cookies essentiels",
      description:
        "Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    analytics: {
      icon: BarChart3,
      title: "Cookies analytiques",
      description:
        "Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    preferences: {
      icon: Heart,
      title: "Cookies de préférences",
      description:
        "Ces cookies mémorisent vos préférences pour personnaliser votre expérience.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    marketing: {
      icon: Target,
      title: "Cookies marketing",
      description:
        "Ces cookies permettent de vous proposer des contenus et publicités pertinents.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des cookies
                </h2>
                <p className="text-sm text-gray-600">
                  Personnalisez vos préférences de confidentialité
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Introduction */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    À propos des cookies
                  </h3>
                  <p className="text-sm text-blue-800">
                    Les cookies sont de petits fichiers stockés sur votre
                    appareil qui nous aident à améliorer votre expérience. Vous
                    pouvez choisir quels types de cookies accepter ci-dessous.
                  </p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {(Object.keys(categoryInfo) as Array<keyof CookieCategories>).map(
                (category) => {
                  const info = categoryInfo[category];
                  const Icon = info.icon;
                  const isExpanded = expandedCategories.has(category);
                  const cookiesInCategory =
                    CookieService.getCookiesByCategory(category);

                  return (
                    <div
                      key={category}
                      className={`border rounded-lg ${info.borderColor} ${info.bgColor}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className={`w-5 h-5 ${info.color}`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {info.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {info.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCategoryExpansion(category)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={isExpanded ? "Réduire" : "Développer"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={localCategories[category]}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      category,
                                      e.target.checked
                                    )
                                  }
                                  disabled={category === "essential"}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-11 h-6 rounded-full transition-colors ${
                                    localCategories[category]
                                      ? "bg-orange-500"
                                      : "bg-gray-300"
                                  } ${
                                    category === "essential" ? "opacity-75" : ""
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                                      localCategories[category]
                                        ? "transform translate-x-6"
                                        : "transform translate-x-1"
                                    } mt-1`}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Détails étendus */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-3">
                              <h5 className="text-sm font-medium text-gray-900">
                                Cookies dans cette catégorie :
                              </h5>
                              <div className="grid gap-3">
                                {cookiesInCategory.map((cookie) => (
                                  <div
                                    key={cookie.name}
                                    className="bg-white p-3 rounded-lg border border-gray-200"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h6 className="text-sm font-medium text-gray-900">
                                          {cookie.name}
                                        </h6>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {cookie.description}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          <span className="font-medium">
                                            Durée:
                                          </span>{" "}
                                          {cookie.duration} |
                                          <span className="font-medium">
                                            {" "}
                                            Fournisseur:
                                          </span>{" "}
                                          {cookie.provider}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Bouton pour afficher les détails complets */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                {showDetails ? "Masquer" : "Voir"} les détails techniques
                complets
              </button>

              {showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Rapport détaillé des cookies
                  </h4>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(
                      CookieService.generateCookieReport(),
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="text-xs text-gray-500">
              <p>
                Ces paramètres seront mémorisés pour 1 an. Vous pouvez les
                modifier à tout moment depuis le pied de page de notre site.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 rounded-lg transition-colors"
              >
                Tout accepter
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieManager;
