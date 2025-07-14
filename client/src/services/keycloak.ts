import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://login.fitnessconnect.fr/',
  realm: 'MY-REALM',
  clientId: 'my-web-client',
});

export default keycloak;