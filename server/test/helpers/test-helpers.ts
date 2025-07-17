import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

export interface TestUser {
  id: string;
  email: string;
  roles: string[];
  sub: string;
  preferred_username: string;
}

export class TestHelpers {
  constructor(private app: INestApplication) {}

  /**
   * Génère un token JWT pour les tests
   */
  generateTestToken(user: Partial<TestUser> = {}): string {
    const defaultUser: TestUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      roles: ['client'],
      sub: 'test-user-sub',
      preferred_username: 'testuser',
      ...user,
    };

    const payload = {
      sub: defaultUser.sub,
      email: defaultUser.email,
      preferred_username: defaultUser.preferred_username,
      realm_access: {
        roles: defaultUser.roles,
      },
      resource_access: {
        account: {
          roles: ['manage-account', 'manage-account-links', 'view-profile'],
        },
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      ...user, // Allow custom fields
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
  }

  /**
   * Génère un token JWT pour un client
   */
  generateClientToken(clientData: Partial<TestUser> = {}): string {
    return this.generateTestToken({
      roles: ['client'],
      email: 'client@example.com',
      preferred_username: 'testclient',
      ...clientData,
    });
  }

  /**
   * Génère un token JWT pour un coach
   */
  generateCoachToken(coachData: Partial<TestUser> = {}): string {
    return this.generateTestToken({
      roles: ['coach'],
      email: 'coach@example.com',
      preferred_username: 'testcoach',
      ...coachData,
    });
  }

  /**
   * Génère un token JWT pour un admin
   */
  generateAdminToken(adminData: Partial<TestUser> = {}): string {
    return this.generateTestToken({
      roles: ['admin'],
      email: 'admin@example.com',
      preferred_username: 'testadmin',
      ...adminData,
    });
  }

  /**
   * Effectue une requête authentifiée
   */
  authenticatedRequest(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    token?: string,
  ) {
    const authToken = token || this.generateTestToken();
    const req = request(this.app.getHttpServer())[method](url);
    return req.set('Authorization', `Bearer ${authToken}`);
  }

  /**
   * Nettoie une table spécifique
   */
  async cleanDatabase<T extends Record<string, any>>(
    repository: Repository<T>,
  ): Promise<void> {
    await repository.clear();
  }

  /**
   * Nettoie la base de données (alias pour cleanAllTables)
   */
  async cleanupDatabase(): Promise<void> {
    await this.cleanAllTables();
  }

  /**
   * Nettoie toutes les tables dans l'ordre correct (gestion des contraintes FK)
   */
  async cleanAllTables(): Promise<void> {
    try {
      const dataSource = this.app.get('DataSource');
      if (!dataSource) {
        console.log('No DataSource available for cleanup');
        return;
      }

      const entityMetadatas = dataSource.entityMetadatas;

      // Désactiver les contraintes FK temporairement
      await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

      // Nettoyer toutes les tables
      for (const entityMetadata of entityMetadatas) {
        const repository = dataSource.getRepository(entityMetadata.name);
        await repository.clear();
      }

      // Réactiver les contraintes FK
      await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.log('Database cleanup not available in test environment');
    }
  }

  /**
   * Seed des données de test
   */
  async seedTestData(data: any): Promise<void> {
    // Pour l'instant, méthode simple qui ne fait rien
    // Dans un vrai projet, on insèrerait les données en base
    console.log('Seeding test data:', data);
  }

  /**
   * Attend un délai spécifié
   */
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Génère une chaîne aléatoire
   */
  generateRandomString(length: number = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Génère un email aléatoire
   */
  generateRandomEmail(domain: string = 'test.com'): string {
    const username = this.generateRandomString(8);
    return `${username}@${domain}`;
  }

  /**
   * Attend qu'une condition soit vraie (utile pour les tests asynchrones)
   */
  async waitFor(
    condition: () => Promise<boolean>,
    timeout = 5000,
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Crée des données de test avec des valeurs par défaut
   */
  createTestData<T>(defaultData: Partial<T>, overrides: Partial<T> = {}): T {
    return { ...defaultData, ...overrides } as T;
  }
}
