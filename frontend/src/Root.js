import React from 'react'

import App from './App';

import { Auth0Provider } from "@auth0/auth0-react";
import { DarkModeProvider } from './DarkMode';
import { TextModeProvider } from './TextMode';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export default function Root() {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
        >
            <React.StrictMode>
                <Router history={history}>
                    <DarkModeProvider>
                        <TextModeProvider>
                            <App />
                        </TextModeProvider>
                    </DarkModeProvider>
                </Router>
            </React.StrictMode>
        </Auth0Provider>
    )
}
