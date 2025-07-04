# 🍪 Politique de Cookies et Conformité RGPD - Fitconnect

Cette documentation présente l'implémentation complète de la politique de cookies et de la conformité RGPD dans l'application Fitconnect.

## 📋 Vue d'ensemble

L'implémentation comprend :

- ✅ Gestion granulaire du consentement des cookies
- ✅ Bannière de cookies conforme RGPD
- ✅ Interface de gestion des préférences
- ✅ Politique de confidentialité complète
- ✅ Intégration avec Keycloak respectueuse du consentement
- ✅ Utilitaires de validation GDPR
- ✅ Nettoyage automatique des cookies non autorisés

## 🏗️ Architecture

### Composants principaux

```
src/
├── context/
│   └── CookieConsentContext.tsx     # Contexte global de gestion du consentement
├── services/
│   └── cookieService.ts             # Service de gestion des cookies
├── utils/
│   └── gdprUtils.ts                 # Utilitaires de conformité GDPR
├── components/privacy/
│   ├── CookieBanner.tsx             # Bannière de consentement
│   ├── CookieManager.tsx            # Interface de gestion avancée
│   └── CookieSettingsButton.tsx     # Bouton d'accès aux paramètres
└── pages/public/PrivacyPolicy/
    └── PrivacyPolicy.tsx            # Page de politique de confidentialité
```

## 🚀 Utilisation

### 1. Contexte de consentement

Le `CookieConsentContext` fournit l'état global du consentement :

```tsx
import { useCookieConsent } from "../context/CookieConsentContext";

function MyComponent() {
  const { consent, acceptAll, rejectAll, updateCategories } =
    useCookieConsent();

  // Vérifier si une catégorie est acceptée
  if (consent.categories.analytics) {
    // Charger Google Analytics
  }
}
```

### 2. Service de cookies

Le `CookieService` permet de gérer les cookies selon le consentement :

```tsx
import { CookieService } from "../services/cookieService";

// Définir un cookie seulement si autorisé
CookieService.setCookie(
  "analytics_id",
  "value",
  { expires: new Date(Date.now() + 86400000) },
  consent.categories
);

// Obtenir un cookie
const value = CookieService.getCookie("analytics_id");
```

### 3. Vérification de catégorie

Utilisez le hook `useCookieCategory` pour des vérifications simples :

```tsx
import { useCookieCategory } from "../context/CookieConsentContext";

function AnalyticsComponent() {
  const analyticsAllowed = useCookieCategory("analytics");

  if (!analyticsAllowed) {
    return <div>Analytics désactivé par l'utilisateur</div>;
  }

  return <GoogleAnalytics />;
}
```

## 🍪 Catégories de cookies

### Essential (Essentiels)

- **Toujours activés** - requis pour le fonctionnement
- Cookies Keycloak (authentification)
- Préférences de consentement
- Cookies de session

### Analytics (Analytiques)

- Google Analytics
- Mesures d'audience
- Statistiques d'utilisation

### Preferences (Préférences)

- Thème (clair/sombre)
- Langue
- Paramètres d'interface

### Marketing (Marketing)

- Cookies publicitaires
- Remarketing
- Tracking social media

## 🔧 Configuration

### Variables d'environnement

```env
# Durée de validité du consentement (jours)
VITE_COOKIE_CONSENT_DURATION=365

# Mode développement pour logs détaillés
NODE_ENV=development
```

### Personnalisation

#### Modifier les catégories de cookies

Éditez le fichier `cookieService.ts` pour ajouter/modifier des cookies :

```tsx
export const COOKIE_CATALOG: CookieDefinition[] = [
  {
    name: "mon_cookie",
    category: "analytics",
    description: "Description du cookie",
    duration: "30 jours",
    purpose: "Objectif du cookie",
    provider: "Fournisseur",
  },
  // ...
];
```

#### Personnaliser la bannière

Modifiez `CookieBanner.tsx` pour ajuster le design :

```tsx
// Changer les couleurs
className="bg-orange-500 hover:bg-orange-600"

// Modifier le texte
<h3>🍪 Votre titre personnalisé</h3>
```

## 📊 Conformité GDPR

### Droits utilisateurs supportés

- ✅ **Droit d'accès** - Export des données
- ✅ **Droit de rectification** - Modification des données
- ✅ **Droit à l'effacement** - Suppression avec certificat
- ✅ **Droit à la portabilité** - Export structuré
- ✅ **Droit d'opposition** - Refus de traitement
- ✅ **Droit de limitation** - Restriction temporaire

### Validation automatique

```tsx
import { GDPRUtils } from "../utils/gdprUtils";

// Générer un rapport de conformité
const report = GDPRUtils.generateComplianceReport(
  userData,
  consent.categories,
  currentCookies
);

// Valider une demande GDPR
const validation = GDPRUtils.validateGDPRRequest({
  userId: "user123",
  type: "erasure",
  description: "Supprimer mes données",
});
```

## 🔒 Sécurité

### Mesures de protection

1. **Chiffrement des données sensibles**
2. **Validation des entrées utilisateur**
3. **Audit trail des actions GDPR**
4. **Signature cryptographique des certificats**
5. **Nettoyage automatique des cookies non autorisés**

### Gestion des données de santé

Les données de santé bénéficient d'une protection renforcée :

- Consentement explicite requis
- Chiffrement supplémentaire
- Audit spécialisé
- Durée de conservation limitée

## 🚀 Déploiement

### Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Politique de confidentialité mise à jour
- [ ] Tests de conformité passés
- [ ] Documentation à jour
- [ ] Formation équipe effectuée

### Tests recommandés

```bash
# Tests unitaires des utilitaires GDPR
npm test gdprUtils

# Tests d'intégration du consentement
npm test cookieConsent

# Tests E2E de la bannière
npm run test:e2e -- --spec="cookie-banner"
```

## 📈 Monitoring

### Métriques importantes

- Taux d'acceptation par catégorie
- Temps moyen avant consentement
- Demandes GDPR reçues
- Violations de conformité détectées

### Logs à surveiller

```javascript
// Consentement donné
console.log("Cookie consent updated:", {
  userId: user.id,
  categories: consentCategories,
  timestamp: new Date().toISOString(),
});

// Violation détectée
console.warn("GDPR compliance violation:", {
  type: "unauthorized_cookie",
  details: violationDetails,
});
```

## 🛠️ Maintenance

### Tâches régulières

1. **Mensuel** : Audit de conformité
2. **Trimestriel** : Mise à jour des cookies catalogués
3. **Semestriel** : Révision de la politique de confidentialité
4. **Annuel** : Renouvellement des consentements

### Mise à jour des cookies

Quand ajouter un nouveau cookie :

1. L'ajouter au `COOKIE_CATALOG`
2. Tester la détection automatique
3. Mettre à jour la documentation
4. Informer les utilisateurs si nécessaire

## 📞 Support

### Contacts

- **DPO** : dpo@fitconnect.com
- **Technique** : dev@fitconnect.com
- **Utilisateurs** : privacy@fitconnect.com

### Ressources utiles

- [Documentation RGPD officielle](https://gdpr.eu/)
- [CNIL - Guide cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs)
- [Keycloak Documentation](https://www.keycloak.org/docs/)

---

## 📝 Changelog

### Version 1.0.0 (2025-01-29)

- ✨ Implémentation initiale complète
- 🍪 Gestion granulaire des cookies
- 📋 Politique de confidentialité RGPD
- 🔐 Intégration Keycloak sécurisée
- 🛠️ Utilitaires de conformité

---

_Cette implémentation respecte les exigences du RGPD et offre une expérience utilisateur optimale tout en garantissant la conformité légale._
