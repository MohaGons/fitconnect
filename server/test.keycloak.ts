import KcAdminClient from '@keycloak/keycloak-admin-client';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function testKeycloakConnection() {
  // Afficher les informations de configuration (sans le secret)
  console.log('Configuration Keycloak:');
  console.log(`URL: ${process.env.KEYCLOAK_URL}`);
  console.log(`Realm: ${process.env.KEYCLOAK_REALM}`);
  console.log(`Client ID: ${process.env.KEYCLOAK_ADMIN_CLIENT_ID}`);

  const username = process.env.KEYCLOAK_ADMIN_USERNAME;
  const password = process.env.KEYCLOAK_ADMIN_PASSWORD;
  const clientId = process.env.KEYCLOAK_ADMIN_CLIENT_ID as string;
  
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
  });

  try {
    console.log('Tentative de connexion à Keycloak...');
    
    await kcAdminClient.auth({
        grantType: 'password',
        clientId: 'admin-cli',
        username: 'admin',
        password: 'admin',
      });
    
    console.log('✅ Connexion réussie !');
    
    // Tester la récupération des rôles
    console.log('Récupération des rôles...');
    const roles = await kcAdminClient.roles.find();
    console.log('✅ Rôles trouvés :', roles.map(r => r.name));
    
    // Vérifier si les rôles COACH et CLIENT existent
    const coachRole = roles.find(r => r.name === 'COACH');
    const clientRole = roles.find(r => r.name === 'CLIENT');
    
    console.log(`Rôle COACH ${coachRole ? 'existe ✅' : 'n\'existe pas ❌'}`);
    console.log(`Rôle CLIENT ${clientRole ? 'existe ✅' : 'n\'existe pas ❌'}`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion :', error);
    if (error.response && error.response.data) {
      console.error('Détails de l\'erreur :', error.response.data);
    }
  }
}

// Exécution du test
testKeycloakConnection().catch(console.error);