import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';

@Injectable()
export class KeycloakService {
  private kcAdminClient: KcAdminClient;
  private lastAuthTime: number = 0;

  constructor(private configService: ConfigService) {
    const keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
    const keycloakRealm = this.configService.get<string>('KEYCLOAK_REALM');

    console.log(
      `Initializing Keycloak Admin Client with URL: ${keycloakUrl}, Realm: ${keycloakRealm}`,
    );

    if (!keycloakUrl || !keycloakRealm) {
      console.error(
        'KEYCLOAK_URL or KEYCLOAK_REALM not defined in environment',
      );
    }

    // Initialiser le client admin Keycloak
    this.kcAdminClient = new KcAdminClient({
      baseUrl: keycloakUrl,
      realmName: keycloakRealm,
    });

    // this.initKeycloakAdmin();
  }

  private async initKeycloakAdmin() {
    try {
      // Récupérer les variables d'environnement pour l'authentification
      const username = this.configService.get<string>(
        'KEYCLOAK_ADMIN_USERNAME',
      );
      const password = this.configService.get<string>(
        'KEYCLOAK_ADMIN_PASSWORD',
      );
      const clientId = this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_ID',
        'admin-cli',
      );
      const clientSecret = this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_SECRET',
      );

      console.log(`Authenticating with Keycloak using username: ${username}`);

      if (!clientSecret) {
        // Si pas de client secret, utiliser l'authentification par identifiants
        if (!username || !password) {
          throw new Error(
            'KEYCLOAK_ADMIN_USERNAME or KEYCLOAK_ADMIN_PASSWORD not defined in environment',
          );
        }

        // Authentification avec Keycloak via un compte utilisateur
        await this.kcAdminClient.auth({
          username,
          password,
          clientId,
          grantType: 'password',
        });
      } else {
        // Authentification avec client credentials
        await this.kcAdminClient.auth({
          clientId,
          clientSecret,
          grantType: 'client_credentials',
        });
      }

      console.log('Keycloak admin client initialized successfully');

      // Vérifier que le token existe bien
      if (!this.kcAdminClient.accessToken) {
        throw new Error('Failed to get access token from Keycloak');
      }

      console.log(
        `Access token acquired: ${this.kcAdminClient.accessToken ? 'Yes' : 'No'}`,
      );

      // Stocker le timestamp d'authentification
      this.lastAuthTime = Date.now();

      // Programmer le renouvellement du token avant expiration
      //this.scheduleTokenRefresh();
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

  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      // Méthode manuelle pour décoder le token JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token does not appear to be a valid JWT');
      }

      // Décoder la partie payload du token (deuxième partie)
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

  // // Fonction améliorée de gestion des rôles
  async assignRole(userId: string, roleName: string): Promise<void> {
    try {
      console.log(`Attempting to assign role ${roleName} to user ${userId}`);

      // S'assurer que l'authentification est fraîche avant d'opérer
      await this.initKeycloakAdmin();

      // Récupérer le rôle
      console.log(`Searching for role: ${roleName}`);
      const roles = await this.kcAdminClient.roles.find();
      console.log(
        'Available roles:',
        roles.map((r) => r.name),
      );

      const targetRole = roles.find((role) => role.name === roleName);

      if (!targetRole) {
        throw new Error(`Role ${roleName} not found in Keycloak`);
      }

      console.log(`Found role ${roleName} with ID ${targetRole.id}`);

      // Vérifier si l'utilisateur existe
      try {
        await this.kcAdminClient.users.findOne({ id: userId });
        console.log(`User ${userId} exists`);
      } catch (userError) {
        console.error(`User ${userId} not found:`, userError);
        throw new Error(`User ${userId} not found`);
      }

      // Assigner le rôle à l'utilisateur
      console.log(`Assigning role ${roleName} to user ${userId}`);
      await this.kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [
          {
            id: targetRole.id!,
            name: targetRole.name!,
          },
        ],
      });

      console.log(`Role ${roleName} assigned to user ${userId} successfully`);
    } catch (error) {
      console.error(`Failed to assign role ${roleName}:`, error);

      if (error.response && error.response.status === 401) {
        console.error(
          'Authorization error. Re-authenticating and trying again...',
        );

        // Re-authentifier et réessayer une fois
        //await this.initKeycloakAdmin();

        try {
          // Récupérer le rôle après ré-authentification
          const roles = await this.kcAdminClient.roles.find();
          const targetRole = roles.find((role) => role.name === roleName);

          if (!targetRole) {
            throw new Error(
              `Role ${roleName} not found in Keycloak after re-auth`,
            );
          }

          // Assigner le rôle après ré-authentification
          await this.kcAdminClient.users.addRealmRoleMappings({
            id: userId,
            roles: [
              {
                id: targetRole.id!,
                name: targetRole.name!,
              },
            ],
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
