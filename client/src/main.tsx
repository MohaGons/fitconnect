import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/App';
import { KeycloakProvider } from './services/keycloakContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </React.StrictMode>
);


// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './routes/App';
// import keycloak from './services/keycloak';
// import { KeycloakContext } from './services/keycloakContext'; 
// import './index.css';

// keycloak
//   .init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' })
//   .then((authenticated: boolean) => {
//     if (authenticated) {
//       createRoot(document.getElementById('root')!).render(
//         <React.StrictMode>
//           <KeycloakContext.Provider value={{ keycloak }}>
//             <App />
//           </KeycloakContext.Provider>
//         </React.StrictMode>
//       );
//     } else { 
//       window.location.href = '/login';
//     }
//   })
//   .catch((err: unknown) => {
//     console.error('Keycloak init error', err);
//   });
