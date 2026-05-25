import { CookieCategories } from "../context/CookieConsentContext";

// Interface pour définir un cookie
export interface CookieDefinition {
  name: string;
  category: keyof CookieCategories;
  description: string;
  duration: string;
  purpose: string;
  provider: string;
}

// Catalogue des cookies utilisés dans l'application
export const COOKIE_CATALOG: CookieDefinition[] = [
  // Cookies essentiels
  {
    name: "KEYCLOAK_SESSION",
    category: "essential",
    description: "Cookie de session pour l'authentification Keycloak",
    duration: "Session",
    purpose: "Maintenir la session utilisateur connectée",
    provider: "Keycloak (Interne)",
  },
  {
    name: "KEYCLOAK_IDENTITY",
    category: "essential",
    description: "Identité utilisateur Keycloak",
    duration: "30 jours",
    purpose: "Identifier l'utilisateur connecté",
    provider: "Keycloak (Interne)",
  },
  {
    name: "fitconnect_cookie_consent",
    category: "essential",
    description: "Stockage des préférences de cookies",
    duration: "1 an",
    purpose: "Mémoriser les choix de consentement aux cookies",
    provider: "FitConnect (Interne)",
  },
  {
    name: "JSESSIONID",
    category: "essential",
    description: "Cookie de session Java",
    duration: "Session",
    purpose: "Maintenir la session côté serveur",
    provider: "FitConnect (Interne)",
  },

  // Cookies de préférences
  {
    name: "theme",
    category: "preferences",
    description: "Préférence de thème (clair/sombre)",
    duration: "Persistant",
    purpose: "Mémoriser le choix de thème de l'utilisateur",
    provider: "FitConnect (Interne)",
  },
  {
    name: "language",
    category: "preferences",
    description: "Préférence de langue",
    duration: "Persistant",
    purpose: "Mémoriser la langue choisie par l'utilisateur",
    provider: "FitConnect (Interne)",
  },

  // Cookies analytiques
  {
    name: "_ga",
    category: "analytics",
    description: "Google Analytics - Identifiant utilisateur",
    duration: "2 ans",
    purpose: "Analyser l'utilisation du site pour améliorer l'expérience",
    provider: "Google Analytics",
  },
  {
    name: "_gid",
    category: "analytics",
    description: "Google Analytics - Identifiant de session",
    duration: "24 heures",
    purpose: "Distinguer les utilisateurs pour les statistiques",
    provider: "Google Analytics",
  },
  {
    name: "_gat",
    category: "analytics",
    description: "Google Analytics - Limitation du taux de requêtes",
    duration: "1 minute",
    purpose: "Limiter la collecte de données à un taux raisonnable",
    provider: "Google Analytics",
  },

  // Cookies marketing (potentiels futurs)
  {
    name: "_fbp",
    category: "marketing",
    description: "Facebook Pixel - Suivi publicitaire",
    duration: "3 mois",
    purpose: "Mesurer l'efficacité des publicités Facebook",
    provider: "Facebook",
  },
  {
    name: "__stripe_*",
    category: "essential",
    description: "Cookies Stripe pour les paiements",
    duration: "Session",
    purpose: "Sécuriser les transactions de paiement",
    provider: "Stripe",
  },
];

export class CookieService {
  // Obtenir tous les cookies d'une catégorie
  static getCookiesByCategory(
    category: keyof CookieCategories
  ): CookieDefinition[] {
    return COOKIE_CATALOG.filter((cookie) => cookie.category === category);
  }

  // Vérifier si un cookie est autorisé selon le consentement
  static isCookieAllowed(
    cookieName: string,
    consent: CookieCategories
  ): boolean {
    const cookieDefinition = COOKIE_CATALOG.find(
      (cookie) => cookieName.includes(cookie.name) || cookie.name.includes("*")
    );

    if (!cookieDefinition) {
      // Si le cookie n'est pas dans notre catalogue, le considérer comme non-essentiel
      console.warn(`Cookie non répertorié détecté: ${cookieName}`);
      return false;
    }

    return consent[cookieDefinition.category];
  }

  // Définir un cookie seulement si autorisé
  static setCookie(
    name: string,
    value: string,
    options: {
      expires?: Date;
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    } = {},
    consent: CookieCategories
  ): boolean {
    if (!this.isCookieAllowed(name, consent)) {
      console.log(`Cookie ${name} bloqué par les préférences de consentement`);
      return false;
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
    return true;
  }

  // Obtenir la valeur d'un cookie
  static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  // Supprimer un cookie
  static deleteCookie(name: string, path: string = "/", domain?: string): void {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;

    // Essayer aussi avec le domaine actuel et ses variantes
    if (!domain) {
      const hostname = window.location.hostname;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${hostname}`;
    }
  }

  // Nettoyer tous les cookies d'une catégorie
  static cleanupCookieCategory(category: keyof CookieCategories): void {
    const cookiesToClean = this.getCookiesByCategory(category);

    cookiesToClean.forEach((cookieDef) => {
      // Obtenir tous les cookies actuels
      const currentCookies = document.cookie.split(";");

      currentCookies.forEach((cookie) => {
        const [name] = cookie.split("=");
        const cleanName = name.trim();

        // Vérifier si ce cookie correspond à la définition
        if (
          cookieDef.name.includes("*")
            ? cleanName.includes(cookieDef.name.replace("*", ""))
            : cleanName === cookieDef.name
        ) {
          this.deleteCookie(cleanName);
        }
      });
    });
  }

  // Obtenir tous les cookies actuels du navigateur
  static getAllCurrentCookies(): {
    name: string;
    value: string;
    category?: keyof CookieCategories;
  }[] {
    const cookies = document.cookie.split(";");

    return cookies
      .map((cookie) => {
        const [name, value] = cookie.split("=");
        const cleanName = name.trim();
        const cookieDef = COOKIE_CATALOG.find((def) =>
          def.name.includes("*")
            ? cleanName.includes(def.name.replace("*", ""))
            : cleanName === def.name
        );

        return {
          name: cleanName,
          value: value ? decodeURIComponent(value.trim()) : "",
          category: cookieDef?.category,
        };
      })
      .filter((cookie) => cookie.name); // Filtrer les cookies vides
  }

  // Générer un rapport de cookies pour l'utilisateur
  static generateCookieReport(): {
    byCategory: Record<keyof CookieCategories, CookieDefinition[]>;
    currentCookies: {
      name: string;
      value: string;
      category?: keyof CookieCategories;
    }[];
    unknownCookies: string[];
  } {
    const byCategory = {
      essential: this.getCookiesByCategory("essential"),
      analytics: this.getCookiesByCategory("analytics"),
      marketing: this.getCookiesByCategory("marketing"),
      preferences: this.getCookiesByCategory("preferences"),
    };

    const currentCookies = this.getAllCurrentCookies();
    const unknownCookies = currentCookies
      .filter((cookie) => !cookie.category)
      .map((cookie) => cookie.name);

    return {
      byCategory,
      currentCookies,
      unknownCookies,
    };
  }

  // Valider la conformité RGPD
  static validateGDPRCompliance(consent: CookieCategories): {
    isCompliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérifier que les cookies essentiels sont acceptés
    if (!consent.essential) {
      issues.push("Les cookies essentiels ne peuvent pas être refusés");
    }

    // Vérifier les cookies actuels par rapport au consentement
    const currentCookies = this.getAllCurrentCookies();
    const unauthorizedCookies = currentCookies.filter(
      (cookie) => cookie.category && !consent[cookie.category]
    );

    if (unauthorizedCookies.length > 0) {
      issues.push(
        `Cookies non autorisés détectés: ${unauthorizedCookies
          .map((c) => c.name)
          .join(", ")}`
      );
      recommendations.push("Nettoyer les cookies non autorisés");
    }

    // Recommandations générales
    if (!consent.analytics) {
      recommendations.push(
        "Considérer l'activation des cookies analytiques pour améliorer votre expérience"
      );
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // Utilitaire pour localStorage avec vérification du consentement
  static setLocalStorageItem(
    key: string,
    value: string,
    category: keyof CookieCategories,
    consent: CookieCategories
  ): boolean {
    if (!consent[category] && category !== "essential") {
      console.log(
        `LocalStorage ${key} bloqué par les préférences de consentement`
      );
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'écriture dans localStorage:", error);
      return false;
    }
  }

  // Nettoyer localStorage selon le consentement
  static cleanupLocalStorage(consent: CookieCategories): void {
    const allowedKeys = ["fitconnect_cookie_consent"]; // Toujours autorisé

    if (consent.essential) {
      allowedKeys.push("token", "theme"); // Ajouter les clés essentielles
    }

    if (consent.preferences) {
      allowedKeys.push("user_preferences", "language", "dashboard_layout");
    }

    if (consent.analytics) {
      allowedKeys.push("analytics_user_id", "session_data");
    }

    // Supprimer les clés non autorisées
    Object.keys(localStorage).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default CookieService;
