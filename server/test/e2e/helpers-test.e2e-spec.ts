import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TestHelpers } from '../helpers/test-helpers';

describe('Test Helpers (e2e)', () => {
  let app: INestApplication;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testHelpers = new TestHelpers(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Token Generation', () => {
    it('should generate a valid JWT token', () => {
      const token = testHelpers.generateTestToken({
        id: 'test-user',
        email: 'test@example.com',
        roles: ['client'],
        sub: 'test-sub',
        preferred_username: 'testuser',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });

    it('should generate client token with correct role', () => {
      const token = testHelpers.generateClientToken();

      expect(token).toBeDefined();
      // Decode JWT payload to verify role (simple base64 decode for test)
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );
      expect(payload.realm_access.roles).toContain('client');
    });

    it('should generate coach token with correct role', () => {
      const token = testHelpers.generateCoachToken();

      expect(token).toBeDefined();
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );
      expect(payload.realm_access.roles).toContain('coach');
    });

    it('should generate admin token with correct role', () => {
      const token = testHelpers.generateAdminToken();

      expect(token).toBeDefined();
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );
      expect(payload.realm_access.roles).toContain('admin');
    });

    it('should generate token with custom data', () => {
      const customData = {
        id: 'custom-id',
        email: 'custom@test.com',
        roles: ['custom-role'],
        sub: 'custom-sub',
        preferred_username: 'customuser',
        custom_field: 'custom_value',
      };

      const token = testHelpers.generateTestToken(customData);
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );

      expect(payload.sub).toBe('custom-sub');
      expect(payload.email).toBe('custom@test.com');
      expect(payload.preferred_username).toBe('customuser');
      expect(payload.custom_field).toBe('custom_value');
    });
  });

  describe('HTTP Request Helpers', () => {
    it('should create authenticated request', async () => {
      const token = testHelpers.generateClientToken();
      const request = testHelpers.authenticatedRequest(
        'get',
        '/unknown-route',
        token,
      );

      expect(request).toBeDefined();
      // Test that the request is properly configured
      const response = await request.expect(404);
      expect(response.status).toBe(404);
    });

    it('should handle different HTTP methods', async () => {
      const token = testHelpers.generateClientToken();

      // Test GET
      const getRequest = testHelpers.authenticatedRequest(
        'get',
        '/unknown-route',
        token,
      );
      await getRequest.expect(404);

      // Test POST
      const postRequest = testHelpers.authenticatedRequest(
        'post',
        '/unknown-route',
        token,
      );
      await postRequest.expect(404);

      // Test PUT
      const putRequest = testHelpers.authenticatedRequest(
        'put',
        '/unknown-route',
        token,
      );
      await putRequest.expect(404);

      // Test DELETE
      const deleteRequest = testHelpers.authenticatedRequest(
        'delete',
        '/unknown-route',
        token,
      );
      await deleteRequest.expect(404);
    });

    it('should handle request with body data', async () => {
      const token = testHelpers.generateCoachToken();
      const testData = { name: 'Test', description: 'Test description' };

      const request = testHelpers
        .authenticatedRequest('post', '/unknown-route', token)
        .send(testData);

      await request.expect(404);
    });

    it('should handle request with query parameters', async () => {
      const token = testHelpers.generateAdminToken();

      const request = testHelpers
        .authenticatedRequest('get', '/unknown-route', token)
        .query({ page: 1, limit: 10 });

      await request.expect(404);
    });
  });

  describe('Database Helpers', () => {
    it('should have database cleanup method', () => {
      expect(testHelpers.cleanupDatabase).toBeDefined();
      expect(typeof testHelpers.cleanupDatabase).toBe('function');
    });

    it('should execute cleanup without errors', async () => {
      // Test que la méthode de nettoyage ne lance pas d'erreur
      await expect(testHelpers.cleanupDatabase()).resolves.not.toThrow();
    });

    it('should have seed data method', () => {
      expect(testHelpers.seedTestData).toBeDefined();
      expect(typeof testHelpers.seedTestData).toBe('function');
    });

    it('should seed test data without errors', async () => {
      const testData = {
        users: [
          {
            id: 'test-user-1',
            email: 'test1@example.com',
            firstName: 'Test1',
            lastName: 'User1',
            role: 'client',
          },
        ],
      };

      await expect(testHelpers.seedTestData(testData)).resolves.not.toThrow();
    });
  });

  describe('Utility Methods', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await testHelpers.wait(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    it('should generate random string', () => {
      const randomString1 = testHelpers.generateRandomString();
      const randomString2 = testHelpers.generateRandomString();

      expect(randomString1).toBeDefined();
      expect(randomString2).toBeDefined();
      expect(randomString1).not.toBe(randomString2);
      expect(randomString1.length).toBe(10); // Default length
    });

    it('should generate random string with custom length', () => {
      const customLength = 20;
      const randomString = testHelpers.generateRandomString(customLength);

      expect(randomString.length).toBe(customLength);
    });

    it('should generate random email', () => {
      const email1 = testHelpers.generateRandomEmail();
      const email2 = testHelpers.generateRandomEmail();

      expect(email1).toBeDefined();
      expect(email2).toBeDefined();
      expect(email1).not.toBe(email2);
      expect(email1).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email format
      expect(email2).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should generate random email with custom domain', () => {
      const customDomain = 'custom-domain.com';
      const email = testHelpers.generateRandomEmail(customDomain);

      expect(email).toContain(`@${customDomain}`);
    });
  });

  describe('Environment Configuration', () => {
    it('should be in test environment', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should have test-specific configuration', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.KEYCLOAK_ENABLED).toBe('false');
    });

    it('should have database configuration for tests', () => {
      // Vérifier que la configuration de test est bien chargée
      expect(process.env.NODE_ENV).toBe('test');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid token gracefully', async () => {
      const invalidToken = 'invalid-token';

      const request = testHelpers.authenticatedRequest(
        'get',
        '/unknown-route',
        invalidToken,
      );
      // Should not throw an error, but return appropriate HTTP response
      await request.expect(404); // Route doesn't exist, but token validation might occur at middleware level
    });

    it('should handle empty token', async () => {
      const emptyToken = '';

      const request = testHelpers.authenticatedRequest(
        'get',
        '/unknown-route',
        emptyToken,
      );
      await request.expect(404);
    });

    it('should handle malformed requests', async () => {
      const token = testHelpers.generateClientToken();

      // Test avec des données malformées
      const request = testHelpers
        .authenticatedRequest('post', '/unknown-route', token)
        .send('invalid-json-data');

      await request.expect(404);
    });
  });

  describe('Performance', () => {
    it('should generate tokens quickly', () => {
      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        testHelpers.generateClientToken();
      }

      const end = Date.now();
      const duration = end - start;

      // Should generate 100 tokens in less than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });
});
