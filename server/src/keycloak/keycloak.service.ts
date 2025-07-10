import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';

@Injectable()
export class KeycloakService {
  private kcAdminClient: KcAdminClient;
  private lastAuthTime: number = 0;

  constructor(private configService: ConfigService) {
    const keycloakUrl = 'https://login.fitnessconnect.fr';
    const keycloakRealm = 'MY-REALM';

    console.log(
      `Initializing Keycloak Admin Client with URL: ${keycloakUrl}, Realm: ${keycloakRealm}`,
    );

    if (!keycloakUrl || !keycloakRealm) {
      console.error('KEYCLOAK_URL or KEYCLOAK_REALM not defined');
    }

    this.kcAdminClient = new KcAdminClient({
      baseUrl: keycloakUrl,
      realmName: keycloakRealm,
    });

    this.initKeycloakAdmin();
  }

  private async initKeycloakAdmin() {
    try {
      const username = 'admin';
      const password = 'admin?fit';
      const clientId = 'admin-cli';
      const clientSecret = 'ObkISiWU00ydpPjjmTpL9lvOkrJAWlzy';

      console.log(`Authenticating with Keycloak using username: ${username}`);

      if (!clientSecret) {
        if (!username || !password) {
          throw new Error('Hardcoded username or password missing');
        }

        await this.kcAdminClient.auth({
          username,
          password,
          clientId,
          grantType: 'password',
        });
        console.log(`Keyckloak Initialized with password `);
      } else {
        await this.kcAdminClient.auth({
          clientId,
          clientSecret,
          grantType: 'client_credentials',
        });
        console.log(`Keyckloak Initialized with secret `);
      }

      console.log('Keycloak admin client initialized successfully');

      if (!this.kcAdminClient.accessToken) {
        throw new Error('Failed to get access token from Keycloak');
      }

      console.log(
        `Access token acquired: ${this.kcAdminClient.accessToken ? 'Yes' : 'No'}`,
      );

      this.lastAuthTime = Date.now();

      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to initialize Keycloak admin client:', error);
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
      }
    }
  }

  async updateUser(
    keycloakId: string,
    data: Partial<{ firstName: string; lastName: string; email: string }>,
  ) {
    await this.initKeycloakAdmin();
    return await this.kcAdminClient.users.update({ id: keycloakId }, data);
  }

  async deleteUser(keycloakId: string): Promise<void> {
    await this.initKeycloakAdmin();
    await this.kcAdminClient.users.del({ id: keycloakId });
  }

  private scheduleTokenRefresh() {
    try {
      const token = this.kcAdminClient.accessToken;

      if (!token) {
        console.error('Access token is undefined, cannot schedule refresh');
        return;
      }

      console.log('Token exists, attempting to decode it');
      console.log('Token type:', typeof token);

      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Token does not appear to be a valid JWT');
          return;
        }

        const payload = Buffer.from(parts[1], 'base64').toString();
        const payloadObj = JSON.parse(payload);

        if (payloadObj && payloadObj.exp) {
          const expiresIn = payloadObj.exp * 1000 - Date.now();
          const expTimeUTC = new Date(payloadObj.exp * 1000).toISOString();
          const expTimeLocal = new Date(payloadObj.exp * 1000).toString();

          console.log(`Token expiration time (UTC): ${expTimeUTC}`);
          console.log(`Token expiration time (Local): ${expTimeLocal}`);
          console.log(`Current time (UTC): ${new Date().toISOString()}`);
          console.log(`Current time (Local): ${new Date().toString()}`);
          console.log(
            `Time until expiration: ${Math.floor(expiresIn / 1000)} seconds`,
          );

          if (expiresIn <= 60000) {
            console.log(
              'Token expired or expiring very soon, refreshing immediately',
            );
            this.refreshToken();
            return;
          }

          const refreshTime = Math.max(expiresIn - 60000, 0);
          console.log(
            `Token refresh scheduled in ${Math.floor(refreshTime / 1000)} seconds`,
          );

          setTimeout(() => this.refreshToken(), refreshTime);
        } else {
          console.error('Could not find expiration time in token payload');
        }
      } catch (decodeError) {
        console.error('Error manually decoding token:', decodeError);
        console.log('Scheduling default token refresh in 4 minutes');
        setTimeout(() => this.refreshToken(), 4 * 60 * 1000);
      }
    } catch (error) {
      console.error('Error in scheduleTokenRefresh:', error);
      console.log('Scheduling default token refresh in 4 minutes');
      setTimeout(() => this.refreshToken(), 4 * 60 * 1000);
    }
  }

  private async refreshToken() {
    try {
      await this.initKeycloakAdmin();
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setTimeout(() => this.refreshToken(), 30 * 1000);
    }
  }

  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3)
        throw new Error('Token does not appear to be a valid JWT');

      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );

      const payload = Buffer.from(padded, 'base64').toString();
      const decoded = JSON.parse(payload);

      return decoded?.sub || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  async assignRole(userId: string, roleName: string): Promise<void> {
    try {
      console.log(`Attempting to assign role ${roleName} to user ${userId}`);
      await this.initKeycloakAdmin();

      console.log(`Searching for role: ${roleName}`);
      const roles = await this.kcAdminClient.roles.find();
      console.log(
        'Available roles:',
        roles.map((r) => r.name),
      );

      const targetRole = roles.find((role) => role.name === roleName);
      if (!targetRole)
        throw new Error(`Role ${roleName} not found in Keycloak`);

      console.log(`Found role ${roleName} with ID ${targetRole.id}`);

      try {
        await this.kcAdminClient.users.findOne({ id: userId });
        console.log(`User ${userId} exists`);
      } catch (userError) {
        console.error(`User ${userId} not found:`, userError);
        throw new Error(`User ${userId} not found`);
      }

      console.log(`Assigning role ${roleName} to user ${userId}`);
      await this.kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{ id: targetRole.id!, name: targetRole.name! }],
      });

      console.log(`Role ${roleName} assigned to user ${userId} successfully`);
    } catch (error) {
      console.error(`Failed to assign role ${roleName}:`, error);

      if (error.response && error.response.status === 401) {
        console.error(
          'Authorization error. Re-authenticating and trying again...',
        );
        await this.initKeycloakAdmin();

        try {
          const roles = await this.kcAdminClient.roles.find();
          const targetRole = roles.find((role) => role.name === roleName);
          if (!targetRole)
            throw new Error(
              `Role ${roleName} not found in Keycloak after re-auth`,
            );

          await this.kcAdminClient.users.addRealmRoleMappings({
            id: userId,
            roles: [{ id: targetRole.id!, name: targetRole.name! }],
          });

          console.log(
            `Role ${roleName} assigned to user ${userId} after re-auth`,
          );
          return;
        } catch (retryError) {
          console.error(
            'Failed to assign role even after re-auth:',
            retryError,
          );
          throw retryError;
        }
      }

      throw error;
    }
  }

  async assignCoachRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'COACH');
  }

  async assignClientRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'CLIENT');
  }
}
