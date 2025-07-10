# 🧪 Guide des Tests Fonctionnels - FitConnect

Ce document présente la configuration complète des tests fonctionnels pour la plateforme FitConnect.

## 📋 Vue d'ensemble

### Architecture des Tests

```
projet-annuel/
├── server/                      # Tests API (Backend)
│   ├── test/
│   │   ├── e2e/                # Tests End-to-End API
│   │   ├── helpers/            # Utilitaires de test
│   │   ├── factories/          # Factories pour données de test
│   │   └── setup-e2e.ts       # Configuration globale
│   └── package.json
└── client/                      # Tests UI (Frontend)
    ├── cypress/
    │   ├── e2e/                # Tests End-to-End UI
    │   ├── support/            # Commandes personnalisées
    │   └── fixtures/           # Données de test
    └── package.json
```

## 🏗️ Configuration Serveur (API Tests)

### Technologies Utilisées

- **Jest** - Framework de test principal
- **Supertest** - Tests HTTP
- **TypeORM** - Base de données de test
- **Factory Pattern** - Génération de données de test

### Configuration de Base

```bash
# Installation des dépendances
cd server
npm install --save-dev @nestjs/testing supertest jest-environment-node @types/supertest factory.ts faker cross-env

# Lancement des tests
npm run test:e2e                # Tests E2E simples
npm run test:e2e:watch         # Mode watch
npm run test:e2e:cov           # Avec couverture de code
npm run test:functional        # Alias pour tests fonctionnels
npm run test:all               # Tests unitaires + E2E
npm run test:ci                # Pour CI/CD
```

### Structure des Tests API

#### 1. Tests d'Authentification (`auth.e2e-spec.ts`)

- ✅ Authentification JWT
- ✅ Autorisation par rôles (Client, Coach, Admin)
- ✅ Validation des tokens
- ✅ Gestion des sessions expirées
- ✅ Tests de sécurité

#### 2. Tests de Workflow Complet (`coach-client-workflow.e2e-spec.ts`)

- ✅ Inscription et onboarding des coaches
- ✅ Création de programmes d'entraînement
- ✅ Inscription et assignation des clients
- ✅ Suivi des progrès et sessions
- ✅ Gestion des erreurs

### Utilisation des Factories

```typescript
// Exemple d'utilisation des factories
import { UserFactory, ProgramFactory } from "../factories";

// Créer un coach de test
const coach = UserFactory.createCoach({
  email: "test@coach.com",
  specialties: ["strength_training"],
  hourlyRate: 80,
});

// Créer un programme
const program = ProgramFactory.createStrengthProgram(coach.id, {
  name: "Programme Force Débutant",
  duration: 8,
});
```

### Helpers de Test

```typescript
// Utilisation des helpers
import { TestHelpers } from "../helpers/test-helpers";

const testHelpers = new TestHelpers(app);

// Authentification automatique
const coachToken = testHelpers.generateCoachToken();
const response = await testHelpers
  .authenticatedRequest("get", "/programs", coachToken)
  .expect(200);

// Nettoyage de la base de données
await testHelpers.cleanAllTables();
```

## 🖥️ Configuration Client (UI Tests)

### Technologies Utilisées

- **Cypress** - Framework de test E2E
- **Testing Library** - Sélecteurs et utilitaires
- **Real Events** - Simulation d'événements réels
- **File Upload** - Tests d'upload de fichiers

### Configuration de Base

```bash
# Installation des dépendances
cd client
npm install --save-dev @testing-library/cypress @cypress/code-coverage nyc cypress-real-events cypress-file-upload @types/cypress

# Lancement des tests
npm run test:e2e              # Tests E2E simples
npm run test:e2e:headed       # Mode visible (headed)
npm run test:e2e:watch        # Mode interactif
npm run test:functional       # Alias pour tests fonctionnels
npm run test:all              # Tests unitaires + E2E
npm run test:ci               # Pour CI/CD
```

### Structure des Tests UI

#### 1. Tests des Pages Légales (`legal-pages.cy.ts`)

- ✅ Navigation et contenu des CGU
- ✅ Navigation et contenu des CGV
- ✅ Formulaire de contact complet
- ✅ Validation des formulaires
- ✅ Gestion des erreurs
- ✅ Tests responsive
- ✅ Performance et accessibilité

#### 2. Tests de Parcours Utilisateur (`user-journey.cy.ts`)

- ✅ Parcours complet client (découverte → inscription → coaching)
- ✅ Parcours complet coach (inscription → création programmes → gestion clients)
- ✅ Interaction client-coach complète
- ✅ Réservation et séances d'entraînement
- ✅ Gestion des erreurs réseau
- ✅ Expiration de session

### Commandes Personnalisées

```typescript
// Authentification
cy.loginAsClient();
cy.loginAsCoach();
cy.loginAsAdmin();
cy.logout();

// Navigation
cy.navigateToDashboard();
cy.navigateToSection("programs");

// Formulaires
cy.fillContactForm({
  firstName: "John",
  lastName: "Doe",
  email: "john@test.com",
  subject: "information",
  message: "Question sur les services",
});

cy.createProgram({
  name: "Mon Programme",
  description: "Description...",
  duration: 8,
  difficulty: "intermediate",
  type: "strength",
});

// API et données
cy.apiRequest("GET", "/api/programs");
cy.cleanTestData();
cy.seedTestData({ type: "coaches", count: 3 });

// UI Helpers
cy.waitForElement("[data-cy=dashboard]");
cy.scrollToElement("[data-cy=footer]");
cy.checkValidationErrors(["email", "password"]);
cy.checkA11y();
cy.measurePagePerformance();
```

## 🚀 Exécution des Tests

### Développement Local

```bash
# Lancer tous les tests
npm run test:all               # Dans server/ et client/

# Tests serveur uniquement
cd server
npm run test:e2e:watch        # Mode watch avec rechargement auto

# Tests client uniquement
cd client
npm run test:e2e:watch        # Interface Cypress interactive
npm run test:e2e:headed       # Mode visible pour debugging
```

### Environnement CI/CD

```bash
# Pipeline complet
npm run test:ci               # Tests avec couverture de code

# Tests parallèles
npm run test:functional       # Alias unifié pour les deux parties
```

### Configuration des Variables d'Environnement

#### Serveur (.env.test)

```env
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing-only
KEYCLOAK_ENABLED=false

# Base de données de test
TEST_DB_HOST=localhost
TEST_DB_PORT=3307
TEST_DB_USER=test_user
TEST_DB_PASSWORD=test_password
TEST_DB_NAME=fitconnect_test
```

#### Client (cypress.config.js)

```javascript
env: {
  API_URL: 'http://localhost:3000',
  KEYCLOAK_URL: 'http://localhost:8080',
  TEST_USER_EMAIL: 'testuser@example.com',
  TEST_USER_PASSWORD: 'testpassword123',
  TEST_COACH_EMAIL: 'testcoach@example.com',
  TEST_COACH_PASSWORD: 'coachpassword123',
  ENABLE_COVERAGE: true,
  SLOW_TEST_THRESHOLD: 10000
}
```

## 📊 Couverture de Test

### Métriques Cibles

- **Couverture de code** : > 80%
- **Tests E2E** : Couverture des parcours critiques
- **Tests d'intégration** : Toutes les API principales
- **Tests UI** : Pages principales et formulaires

### Rapport de Couverture

```bash
# Générer les rapports
cd server && npm run test:e2e:cov     # Rapport API
cd client && npm run test:ci          # Rapport UI

# Les rapports sont générés dans :
# server/coverage-e2e/
# client/coverage/
```

## 🎯 Scénarios de Test Couverts

### 📱 Tests d'Interface Utilisateur

#### Pages Publiques

- [x] Page d'accueil et navigation
- [x] Pages légales (CGU, CGV)
- [x] Formulaire de contact
- [x] FAQ et services
- [x] Tarifs et équipe

#### Authentification

- [x] Inscription client/coach
- [x] Connexion via Keycloak
- [x] Gestion des sessions
- [x] Déconnexion sécurisée

#### Dashboard Client

- [x] Configuration du profil
- [x] Recherche et sélection de coach
- [x] Demande de coaching
- [x] Réservation de séances
- [x] Suivi des progrès

#### Dashboard Coach

- [x] Profil et onboarding
- [x] Création de programmes
- [x] Gestion des exercices
- [x] Acceptation des demandes
- [x] Suivi des clients

### 🔧 Tests d'API

#### Authentification & Autorisation

- [x] JWT Token validation
- [x] Contrôle d'accès par rôles
- [x] Sécurité des endpoints
- [x] Gestion des sessions expirées

#### Gestion des Utilisateurs

- [x] CRUD Coaches
- [x] CRUD Clients
- [x] Assignation Coach-Client
- [x] Gestion des profils

#### Programmes & Exercices

- [x] Création de programmes
- [x] Gestion des exercices
- [x] Attribution aux clients
- [x] Suivi des sessions

#### Workflows Métier

- [x] Inscription → Onboarding → Coaching
- [x] Création programme → Assignation → Exécution
- [x] Session → Feedback → Progrès
- [x] Gestion des erreurs et edge cases

## 🛠️ Bonnes Pratiques

### Organisation des Tests

- **Nommage descriptif** : Noms de tests explicites
- **Structure AAA** : Arrange, Act, Assert
- **Isolation** : Chaque test est indépendant
- **Données de test** : Utilisation des factories
- **Nettoyage** : Reset de l'état entre les tests

### Sélecteurs UI

```html
<!-- Utiliser data-cy pour les sélecteurs de test -->
<button data-cy="submit-button">Envoyer</button>
<form data-cy="contact-form">...</form>
<div data-cy="success-message">...</div>
```

### Gestion des Erreurs

- **Tests négatifs** : Scénarios d'erreur
- **Validation** : Messages d'erreur appropriés
- **Resilience** : Gestion des pannes réseau
- **UX** : États de chargement et feedback

## 🚨 Debugging et Troubleshooting

### Problèmes Courants

#### Tests API qui échouent

```bash
# Vérifier la base de données de test
npm run migration:run

# Nettoyer et relancer
npm run test:e2e -- --verbose
```

#### Tests Cypress qui échouent

```bash
# Mode debug avec interface
npm run test:e2e:watch

# Screenshots et vidéos dans cypress/
cypress run --headed --no-exit
```

#### Problèmes de Performance

```bash
# Augmenter les timeouts
# Dans cypress.config.js :
defaultCommandTimeout: 10000
pageLoadTimeout: 30000
```

### Logs et Monitoring

```typescript
// Activer les logs detaillés
cy.log("Starting user registration flow");

// Capture d'écran conditionnelle
if (Cypress.config("screenshotOnRunFailure")) {
  cy.screenshot("test-failure");
}
```

## 📈 Intégration Continue

### Pipeline GitHub Actions

```yaml
name: Tests Fonctionnels
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: cd server && npm ci
      - name: Run API tests
        run: cd server && npm run test:ci

  ui-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: cd client && npm ci
      - name: Run UI tests
        run: cd client && npm run test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📝 Prochaines Étapes

### Améliorations Futures

- [ ] Tests de performance (load testing)
- [ ] Tests de sécurité avancés
- [ ] Tests multi-navigateurs
- [ ] Tests mobiles (responsive)
- [ ] Tests d'accessibilité complets
- [ ] Integration avec monitoring (Sentry, DataDog)

### Métriques à Suivre

- [ ] Temps d'exécution des tests
- [ ] Taux de réussite en CI/CD
- [ ] Couverture de code
- [ ] Détection précoce des régressions

---

**🎉 Configuration Terminée !**

Les tests fonctionnels sont maintenant configurés et prêts à être utilisés. Cette infrastructure de test robuste garantit la qualité et la fiabilité de la plateforme FitConnect.

Pour toute question ou amélioration, n'hésitez pas à consulter la documentation des frameworks utilisés ou à créer une issue dans le projet.
