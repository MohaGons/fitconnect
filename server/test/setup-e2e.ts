import { TestHelpers } from './helpers/test-helpers';

// Configuration globale pour tous les tests E2E
beforeAll(async () => {
  // Configuration timezone pour les tests
  process.env.TZ = 'UTC';

  // Variables d'environnement pour les tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.KEYCLOAK_ENABLED = 'false';

  // Augmenter les timeouts pour les opérations de base de données
  jest.setTimeout(30000);
});

afterAll(async () => {
  // Nettoyage global après tous les tests
  // Jest se charge de fermer les connexions automatiquement
});

// Fonction utilitaire globale pour les tests
declare global {
  namespace NodeJS {
    interface Global {
      testHelpers: TestHelpers;
    }
  }
}

// Désactiver les logs de console pendant les tests (optionnel)
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
