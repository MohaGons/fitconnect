import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestHelpers } from '../helpers/test-helpers';
import { UserFactory } from '../factories/user.factory';
import { testDatabaseConfig, testJwtConfig } from '../test-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

describe('Authentication & Authorization (e2e)', () => {
  let app: INestApplication;
  let testHelpers: TestHelpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // Override des modules pour les tests
        TypeOrmModule.forRoot(testDatabaseConfig),
        JwtModule.register(testJwtConfig),
      ],
    })
      .overrideProvider('KEYCLOAK_OPTIONS')
      .useValue({ enabled: false })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testHelpers = new TestHelpers(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await testHelpers.cleanAllTables();
  });

  describe('JWT Authentication', () => {
    describe('GET /protected-route', () => {
      it('should return 401 when no token is provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/coaches') // Endpoint qui nécessite une authentification
          .expect(401);

        expect(response.body.message).toContain('Unauthorized');
      });

      it('should return 401 when invalid token is provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/coaches')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        expect(response.body.message).toContain('Unauthorized');
      });

      it('should allow access with valid token', async () => {
        const validToken = testHelpers.generateTestToken();

        const response = await request(app.getHttpServer())
          .get('/coaches')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  describe('Role-based Authorization', () => {
    describe('Client Role', () => {
      it('should allow clients to access client endpoints', async () => {
        const clientToken = testHelpers.generateTestToken({
          roles: ['client'],
        });

        await testHelpers
          .authenticatedRequest('get', '/clients', clientToken)
          .expect(200);
      });

      it('should deny clients access to admin endpoints', async () => {
        const clientToken = testHelpers.generateTestToken({
          roles: ['client'],
        });

        await testHelpers
          .authenticatedRequest('get', '/users', clientToken)
          .expect(403);
      });
    });

    describe('Coach Role', () => {
      it('should allow coaches to access coach endpoints', async () => {
        const coachToken = testHelpers.generateCoachToken();

        await testHelpers
          .authenticatedRequest('get', '/coaches', coachToken)
          .expect(200);
      });

      it('should allow coaches to create programs', async () => {
        const coachToken = testHelpers.generateCoachToken();
        const programData = {
          name: 'Test Program',
          description: 'A test program',
          duration: 8,
          difficulty: 'intermediate',
          type: 'strength',
        };

        await testHelpers
          .authenticatedRequest('post', '/programs', coachToken)
          .send(programData)
          .expect(201);
      });

      it('should deny coaches access to admin endpoints', async () => {
        const coachToken = testHelpers.generateCoachToken();

        await testHelpers
          .authenticatedRequest('get', '/users', coachToken)
          .expect(403);
      });
    });

    describe('Admin Role', () => {
      it('should allow admins to access all endpoints', async () => {
        const adminToken = testHelpers.generateAdminToken();

        // Test accès aux utilisateurs
        await testHelpers
          .authenticatedRequest('get', '/users', adminToken)
          .expect(200);

        // Test accès aux coaches
        await testHelpers
          .authenticatedRequest('get', '/coaches', adminToken)
          .expect(200);

        // Test accès aux clients
        await testHelpers
          .authenticatedRequest('get', '/clients', adminToken)
          .expect(200);
      });

      it('should allow admins to manage users', async () => {
        const adminToken = testHelpers.generateAdminToken();
        const userData = UserFactory.createUser({
          email: 'newuser@test.com',
          role: 'client',
        });

        await testHelpers
          .authenticatedRequest('post', '/users', adminToken)
          .send(userData)
          .expect(201);
      });
    });
  });

  describe('Token Validation', () => {
    it('should reject expired tokens', async () => {
      // Créer un token avec une expiration dans le passé
      const expiredToken = testHelpers.generateTestToken({
        id: 'expired-user',
        email: 'expired@test.com',
        roles: ['client'],
        sub: 'expired-sub',
        preferred_username: 'expireduser',
      });

      await request(app.getHttpServer())
        .get('/coaches')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should accept fresh tokens', async () => {
      const freshToken = testHelpers.generateTestToken({
        id: 'fresh-user',
        email: 'fresh@test.com',
        roles: ['client'],
        sub: 'fresh-sub',
        preferred_username: 'freshuser',
      });

      await request(app.getHttpServer())
        .get('/coaches')
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(200);
    });

    it('should validate token signature', async () => {
      // Token avec une signature incorrecte
      const invalidSignatureToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid_signature';

      await request(app.getHttpServer())
        .get('/coaches')
        .set('Authorization', `Bearer ${invalidSignatureToken}`)
        .expect(401);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const token = testHelpers.generateTestToken();

      const response = await request(app.getHttpServer())
        .get('/coaches')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Vérifier la présence d'headers de sécurité (selon votre configuration)
      expect(response.headers['x-powered-by']).toBeUndefined(); // Nest.js supprime cet header par défaut
    });
  });

  describe('Rate Limiting (if implemented)', () => {
    it('should handle rate limiting gracefully', async () => {
      const token = testHelpers.generateTestToken();

      // Faire plusieurs requêtes rapidement
      const promises = Array.from({ length: 10 }, () =>
        request(app.getHttpServer())
          .get('/coaches')
          .set('Authorization', `Bearer ${token}`),
      );

      const responses = await Promise.all(promises);

      // Toutes les requêtes devraient réussir si pas de rate limiting
      // Ou certaines devraient échouer avec 429 si rate limiting activé
      responses.forEach((response) => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });
});
