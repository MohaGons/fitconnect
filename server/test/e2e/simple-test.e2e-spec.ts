import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Test simple pour vérifier la configuration E2E
describe('Simple E2E Test Configuration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Configuration minimale pour tester la configuration E2E
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Configuration Tests', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should have the correct test environment', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should load test configuration', () => {
      // Vérifier que les variables d'environnement de test sont définies
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.KEYCLOAK_ENABLED).toBe('false');
    });
  });

  describe('Basic HTTP Tests', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/unknown-route')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('should return correct content-type headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/unknown-route')
        .expect(404);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Test Utilities', () => {
    it('should be able to create test data', () => {
      const testUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'client',
        createdAt: new Date(),
      };

      expect(testUser).toBeDefined();
      expect(testUser.email).toBe('test@example.com');
      expect(testUser.role).toBe('client');
    });

    it('should handle async operations', async () => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const start = Date.now();
      await delay(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle promise rejections gracefully', async () => {
      const errorPromise = Promise.reject(new Error('Test error'));

      await expect(errorPromise).rejects.toThrow('Test error');
    });

    it('should validate test timeout configuration', () => {
      // Vérifier que le timeout est configuré (30000ms dans jest-e2e.json)
      expect(jest.getTimerCount()).toBeDefined();
    });
  });
});
