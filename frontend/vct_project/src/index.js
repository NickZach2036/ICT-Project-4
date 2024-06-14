import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import App from './App';
import './index.css';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/auth',
    realm: 'bookstore',
    clientId: 'frontend'
});

ReactDOM.render(
    <ReactKeycloakProvider authClient={keycloak}>
        <App />
    </ReactKeycloakProvider>,
    document.getElementById('root')
);
