import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081/', 
  realm: 'MY-REALM',
  clientId: 'my-web-client',
});

export default keycloak;