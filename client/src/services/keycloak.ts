import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://34.38.105.6:8080/', 
  realm: 'MY-REALM',
  clientId: 'my-web-client',
});

export default keycloak;