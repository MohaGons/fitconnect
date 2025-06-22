import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Interfaces TypeScript pour Keycloak
interface KeycloakRole {
  id: string;
  name: string;
  description?: string;
}

interface KeycloakAuthConfig {
  username?: string;
  password?: string;
  clientId: string;
  clientSecret?: string;
  grantType: 'password' | 'client_credentials';
}

interface KeycloakAdminClient {
  auth(config: KeycloakAuthConfig): Promise<void>;
  roles: {
    find(): Promise<KeycloakRole[]>;
  };
  users: {
    addRealmRoleMappings(config: {
      id: string;
      roles: Array<{ id: string; name: string }>;
    }): Promise<void>;
  };
}

interface JWTPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

@Injectable()
export class KeycloakService {
  private kcAdminClient: KeycloakAdminClient | null = null;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    // Initialisation asynchrone sans bloquer le constructor
    void this.initializeWhenNeeded();
  }

  private async initializeWhenNeeded(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Keycloak Admin Client...');

      // Import dynamique avec typage TypeScript strict
      const kcModule = await import('@keycloak/keycloak-admin-client');
      const KcAdminClient = kcModule.default as new (config: {
        baseUrl: string;
        realmName: string;
      }) => KeycloakAdminClient;

      const keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
      const keycloakRealm = this.configService.get<string>('KEYCLOAK_REALM');

      if (!keycloakUrl || !keycloakRealm) {
        throw new Error('KEYCLOAK_URL or KEYCLOAK_REALM not configured');
      }

      console.log(`Keycloak URL: ${keycloakUrl}, Realm: ${keycloakRealm}`);

      this.kcAdminClient = new KcAdminClient({
        baseUrl: keycloakUrl,
        realmName: keycloakRealm,
      });

      // Try client credentials first (recommended)
      const clientId = this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_ID',
      );
      const clientSecret = this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_SECRET',
      );

      if (clientId && clientSecret) {
        console.log('Using client credentials authentication');
        const authConfig: KeycloakAuthConfig = {
          clientId,
          clientSecret,
          grantType: 'client_credentials',
        };
        await this.kcAdminClient.auth(authConfig);
      } else {
        // Fallback to password grant (requires proper client configuration)
        console.log('Using password authentication');
        const username = this.configService.get<string>(
          'KEYCLOAK_ADMIN_USERNAME',
        );
        const password = this.configService.get<string>(
          'KEYCLOAK_ADMIN_PASSWORD',
        );
        const fallbackClientId = clientId || 'admin-cli';

        if (!username || !password) {
          throw new Error(
            'KEYCLOAK_ADMIN_USERNAME or KEYCLOAK_ADMIN_PASSWORD not configured',
          );
        }

        const authConfig: KeycloakAuthConfig = {
          username,
          password,
          clientId: fallbackClientId,
          grantType: 'password',
        };

        await this.kcAdminClient.auth(authConfig);
      }

      this.isInitialized = true;
      console.log('Keycloak admin client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Keycloak admin client:', error);
      this.isInitialized = false;
      this.kcAdminClient = null;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.kcAdminClient) {
      await this.initializeWhenNeeded();
    }

    if (!this.kcAdminClient) {
      throw new Error('Keycloak client failed to initialize');
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      const payloadBase64 = parts[1];
      const payload = Buffer.from(payloadBase64, 'base64').toString();
      const decoded = JSON.parse(payload) as JWTPayload;

      return decoded.sub || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  async assignRole(userId: string, roleName: string): Promise<void> {
    try {
      await this.ensureInitialized();

      if (!this.kcAdminClient) {
        throw new Error('Keycloak client not available');
      }

      console.log(`Assigning role ${roleName} to user ${userId}`);

      const roles: KeycloakRole[] = await this.kcAdminClient.roles.find();
      const targetRole = roles.find(
        (role: KeycloakRole) => role.name === roleName,
      );

      if (!targetRole) {
        const availableRoles = roles.map((r) => r.name).join(', ');
        throw new Error(
          `Role ${roleName} not found. Available roles: ${availableRoles}`,
        );
      }

      await this.kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{ id: targetRole.id, name: targetRole.name }],
      });

      console.log(`Role ${roleName} assigned successfully to user ${userId}`);
    } catch (error) {
      console.error(`Failed to assign role ${roleName}:`, error);
      throw error;
    }
  }

  async assignCoachRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'COACH');
  }

  async assignClientRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'CLIENT');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      return this.isInitialized && this.kcAdminClient !== null;
    } catch {
      return false;
    }
  }
}
