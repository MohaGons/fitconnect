import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '3307'),
  username: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_password',
  database: process.env.TEST_DB_NAME || 'fitconnect_test',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: true, // Pour les tests, on peut synchroniser automatiquement
  dropSchema: true, // Nettoie la DB avant chaque suite de tests
  logging: false, // Désactive les logs SQL pour les tests
};

export const testJwtConfig = {
  secret: 'test-jwt-secret-key-for-testing-only',
  signOptions: { expiresIn: '1h' },
};

export const testKeycloakConfig = {
  enabled: false, // Désactiver Keycloak pour les tests
  realm: 'test-realm',
  'auth-server-url': 'http://localhost:8080/auth',
  'ssl-required': 'none',
  resource: 'test-client',
  'verify-token-audience': false,
  'use-resource-role-mappings': true,
  'confidential-port': 0,
};
