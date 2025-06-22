import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak.34.79.140.130.nip.io',
  realm: 'MY-REALM',
  clientId: 'my-web-client',
});

export default keycloak;