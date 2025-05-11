// src/keycloak/keycloak.service.ts
// import { Injectable, HttpException } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class KeycloakService {
//   private readonly keycloakBaseUrl = 'http://localhost:8081'; // adapte si besoin
//   private readonly realm = 'MY-REALM';
//   private readonly clientId = 'my-nest-client'; 
//   private readonly adminClientId = 'admin-cli'; // ou ton client admin
//   private readonly adminSecret = 'ObkISiWU00ydpPjjmTpL9lvOkrJAWlzy'; // secret du client admin

//   constructor(private readonly httpService: HttpService) {}

//   async getAdminToken(): Promise<string> {
//     const data = new URLSearchParams({
//       grant_type: 'client_credentials',
//       client_id: this.adminClientId,
//       client_secret: this.adminSecret,
//     });

//     const response = await firstValueFrom(
//       this.httpService.post(
//         `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
//         data,
//         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
//       ),
//     );

//     return response.data.access_token;
//   }

//   async getClientUUID(accessToken: string): Promise<string> {
//     const response = await firstValueFrom(
//       this.httpService.get(
//         `${this.keycloakBaseUrl}/admin/realms/${this.realm}/clients`,
//         { headers: { Authorization: `Bearer ${accessToken}` } },
//       ),
//     );

//     const client = response.data.find(c => c.clientId === this.clientId);
//     if (!client) {
//       throw new Error('Client not found');
//     }

//     return client.id;
//   }

//   async getRoleByName(clientUUID: string, roleName: string, accessToken: string) {
//     const response = await firstValueFrom(
//       this.httpService.get(
//         `${this.keycloakBaseUrl}/admin/realms/${this.realm}/clients/${clientUUID}/roles/${roleName}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } },
//       ),
//     );

//     return response.data; // { id, name, description }
//   }

//   async assignRoleToUser(userId: string, roleName: 'COACH' | 'CLIENT') {
//     const adminToken = await this.getAdminToken();
//     const clientUUID = await this.getClientUUID(adminToken);
//     const role = await this.getRoleByName(clientUUID, roleName, adminToken);

//     await firstValueFrom(
//       this.httpService.post(
//         `${this.keycloakBaseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/clients/${clientUUID}`,
//         [role],
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       ),
//     );
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import KcAdminClient from '@keycloak/keycloak-admin-client';
// import jwt from 'jsonwebtoken';

// @Injectable()
// export class KeycloakService {
//   private kcAdminClient: KcAdminClient;
  
//   constructor(private configService: ConfigService) {
//     // Initialiser le client admin Keycloak
//     this.kcAdminClient = new KcAdminClient({
//       baseUrl: this.configService.get<string>('KEYCLOAK_URL'),
//       realmName: this.configService.get<string>('KEYCLOAK_REALM'),
//     });
    
//     this.initKeycloakAdmin();
//   }
  
//   private async initKeycloakAdmin() {
//     try {
//       // Authentification avec Keycloak
//       await this.kcAdminClient.auth({
//         clientId: this.configService.get<any>('KEYCLOAK_ADMIN_CLIENT_ID'),
//         clientSecret: this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_SECRET'),
//         grantType: 'client_credentials',
//       });
      
//       // Configuration du realm
//       this.kcAdminClient.setConfig({
//         realmName: this.configService.get<string>('KEYCLOAK_REALM'),
//       });
      
//       console.log('Keycloak admin client initialized successfully');
//     } catch (error) {
//       console.error('Failed to initialize Keycloak admin client:', error);
//     }
//   }
  
//   async getUserIdFromToken(token: string): Promise<string | null> {
//     try {
//       const decoded: any = jwt.decode(token);
//       return decoded?.sub || null;
//     } catch (error) {
//       console.error('Failed to decode token:', error);
//       return null;
//     }
//   }
  
//   async assignCoachRole(userId: string): Promise<void> {
//     try {
//       // Récupérer le rôle "COACH" de Keycloak
//       const roles = await this.kcAdminClient.roles.find({
//         realm: this.configService.get<string>('KEYCLOAK_REALM'),
//       });
      
//       const coachRole = roles.find(role => role.name === 'COACH');
      
//       if (!coachRole) {
//         throw new Error('COACH role not found in Keycloak');
//       }
      
//       // Assigner le rôle à l'utilisateur
//       await this.kcAdminClient.users.addRealmRoleMappings({
//         id: userId,
//         roles: [
//           {
//             id: coachRole.id!,
//             name: coachRole.name!,
//           },
//         ],
//       });
      
//       console.log(`Role COACH assigned to user ${userId}`);
//     } catch (error) {
//       console.error('Failed to assign COACH role:', error);
//       throw error;
//     }
//   }
  
//   async assignClientRole(userId: string): Promise<void> {
//     try {
//       // Récupérer le rôle "CLIENT" de Keycloak
//       const roles = await this.kcAdminClient.roles.find({
//         realm: this.configService.get<string>('KEYCLOAK_REALM'),
//       });
      
//       const clientRole = roles.find(role => role.name === 'CLIENT');
      
//       if (!clientRole) {
//         throw new Error('CLIENT role not found in Keycloak');
//       }
      
//       // Assigner le rôle à l'utilisateur
//       await this.kcAdminClient.users.addRealmRoleMappings({
//         id: userId,
//         roles: [
//           {
//             id: clientRole.id!,
//             name: clientRole.name!,
//           },
//         ],
//       });
      
//       console.log(`Role CLIENT assigned to user ${userId}`);
//     } catch (error) {
//       console.error('Failed to assign CLIENT role:', error);
//       throw error;
//     }
//   }
// }


// keycloak.service.ts modifié pour gérer l'erreur 401
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';
// Utilisation de CommonJS pour l'import
const jwt = require('jsonwebtoken');

@Injectable()
export class KeycloakService {
  private kcAdminClient: KcAdminClient;
  private lastAuthTime: number = 0;
  
  constructor(private configService: ConfigService) {
    const keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
    const keycloakRealm = this.configService.get<string>('KEYCLOAK_REALM');
    
    console.log(`Initializing Keycloak Admin Client with URL: ${keycloakUrl}, Realm: ${keycloakRealm}`);
    
    if (!keycloakUrl || !keycloakRealm) {
      console.error('KEYCLOAK_URL or KEYCLOAK_REALM not defined in environment');
    }
    
    // Initialiser le client admin Keycloak
    this.kcAdminClient = new KcAdminClient({
      baseUrl: keycloakUrl,
      realmName: keycloakRealm,
    });
    
    this.initKeycloakAdmin();
  }
  
  private async initKeycloakAdmin() {
    try {
      // Récupérer les variables d'environnement pour l'authentification
      const username = this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME');
      const password = this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD');
      const clientId = this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_ID', 'admin-cli');
      const clientSecret = this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_SECRET');
      
      console.log(`Authenticating with Keycloak using username: ${username}`);
      
      if (!clientSecret) {
        // Si pas de client secret, utiliser l'authentification par identifiants
        if (!username || !password) {
          throw new Error('KEYCLOAK_ADMIN_USERNAME or KEYCLOAK_ADMIN_PASSWORD not defined in environment');
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
      
      console.log(`Access token acquired: ${this.kcAdminClient.accessToken ? 'Yes' : 'No'}`);
      
      // Stocker le timestamp d'authentification
      this.lastAuthTime = Date.now();
      
      // Programmer le renouvellement du token avant expiration
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to initialize Keycloak admin client:', error);
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
      }
    }
  }
  
  // Méthode d'assistance pour s'assurer que l'authentification est fraîche
  private async ensureFreshAuth() {
    try {
      // Vérifier si le token existe
      if (!this.kcAdminClient.accessToken) {
        console.log('No access token available, authenticating...');
        await this.initKeycloakAdmin();
        return;
      }
      
      // Décoder le token pour vérifier l'expiration
      const parts = this.kcAdminClient.accessToken.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format, re-authenticating...');
        await this.initKeycloakAdmin();
        return;
      }
      
      // Décoder la partie payload
      const payload = Buffer.from(parts[1], 'base64').toString();
      const payloadObj = JSON.parse(payload);
      
      if (payloadObj && payloadObj.exp) {
        // Calculer le temps restant avant expiration
        const expiresIn = payloadObj.exp * 1000 - Date.now();
        
        // Si le token expire dans moins de 30 secondes, renouveler
        if (expiresIn < 30000) {
          console.log('Token expiring soon (less than 30 seconds), refreshing...');
          await this.initKeycloakAdmin();
        } else {
          console.log(`Token still valid for ${Math.floor(expiresIn / 1000)} seconds`);
        }
      } else {
        // Si pas d'expiration trouvée, renouveler par précaution
        console.log('Cannot determine token expiration, re-authenticating to be safe');
        await this.initKeycloakAdmin();
      }
    } catch (error) {
      console.error('Error checking token freshness, re-authenticating:', error);
      await this.initKeycloakAdmin();
    }
  }
  
  private scheduleTokenRefresh() {
    try {
      // Récupérer le token et sa durée de validité
      const token = this.kcAdminClient.accessToken;
      
      if (!token) {
        console.error('Access token is undefined, cannot schedule refresh');
        return;
      }
      
      console.log('Token exists, attempting to decode it');
      console.log('Token type:', typeof token);
      
      try {
        // Diviser le token en parties
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Token does not appear to be a valid JWT');
          return;
        }
        
        // Décoder la partie payload du token (deuxième partie)
        const payload = Buffer.from(parts[1], 'base64').toString();
        const payloadObj = JSON.parse(payload);
        
        if (payloadObj && payloadObj.exp) {
          // Calculer le temps avant expiration (en ms)
          const expiresIn = payloadObj.exp * 1000 - Date.now();
          
          // Afficher à la fois UTC et heure locale pour clarifier le problème de fuseau horaire
          const expTimeUTC = new Date(payloadObj.exp * 1000).toISOString();
          const expTimeLocal = new Date(payloadObj.exp * 1000).toString();
          
          console.log(`Token expiration time (UTC): ${expTimeUTC}`);
          console.log(`Token expiration time (Local): ${expTimeLocal}`);
          console.log(`Current time (UTC): ${new Date().toISOString()}`);
          console.log(`Current time (Local): ${new Date().toString()}`);
          console.log(`Time until expiration: ${Math.floor(expiresIn / 1000)} seconds`);
          
          // Si le token est déjà expiré ou va expirer très bientôt, rafraîchir immédiatement
          if (expiresIn <= 60000) { // 60 secondes ou moins
            console.log('Token expired or expiring very soon, refreshing immediately');
            this.refreshToken();
            return;
          }
          
          // Renouveler le token 1 minute avant expiration
          const refreshTime = Math.max(expiresIn - 60000, 0);
          console.log(`Token refresh scheduled in ${Math.floor(refreshTime / 1000)} seconds`);
          
          setTimeout(() => this.refreshToken(), refreshTime);
        } else {
          console.error('Could not find expiration time in token payload');
        }
      } catch (decodeError) {
        console.error('Error manually decoding token:', decodeError);
        
        // Fallback: planifier un refresh standard après 4 minutes
        console.log('Scheduling default token refresh in 4 minutes');
        setTimeout(() => this.refreshToken(), 4 * 60 * 1000);
      }
    } catch (error) {
      console.error('Error in scheduleTokenRefresh:', error);
      
      // Fallback: planifier un refresh standard après 4 minutes
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
      
      // Nouvelle tentative dans 30 secondes en cas d'échec
      setTimeout(() => this.refreshToken(), 30 * 1000);
    }
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
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      
      const payload = Buffer.from(padded, 'base64').toString();
      const decoded = JSON.parse(payload);
      
      return decoded?.sub || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
  
  // Fonction améliorée de gestion des rôles
  async assignRole(userId: string, roleName: string): Promise<void> {
    try {
      console.log(`Attempting to assign role ${roleName} to user ${userId}`);
      
      // S'assurer que l'authentification est fraîche avant d'opérer
      await this.ensureFreshAuth();
      
      // Récupérer le rôle
      console.log(`Searching for role: ${roleName}`);
      const roles = await this.kcAdminClient.roles.find();
      console.log('Available roles:', roles.map(r => r.name));
      
      const targetRole = roles.find(role => role.name === roleName);
      
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
        console.error('Authorization error. Re-authenticating and trying again...');
        
        // Re-authentifier et réessayer une fois
        await this.initKeycloakAdmin();
        
        try {
          // Récupérer le rôle après ré-authentification
          const roles = await this.kcAdminClient.roles.find();
          const targetRole = roles.find(role => role.name === roleName);
          
          if (!targetRole) {
            throw new Error(`Role ${roleName} not found in Keycloak after re-auth`);
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
          
          console.log(`Role ${roleName} assigned to user ${userId} after re-auth`);
          return;
        } catch (retryError) {
          console.error('Failed to assign role even after re-auth:', retryError);
          throw retryError;
        }
      }
      
      throw error;
    }
  }
  
  // Méthodes existantes utilisant la nouvelle méthode unifiée
  async assignCoachRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'COACH');
  }
  
  async assignClientRole(userId: string): Promise<void> {
    return this.assignRole(userId, 'CLIENT');
  }
}