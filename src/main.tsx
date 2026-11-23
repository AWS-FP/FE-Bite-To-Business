import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import './i18n';
import App from './App.tsx';
import { startRum } from './lib/rum';
import { restoreSession } from './services/axiosClient';
startRum();
// Sessions are not stored in the browser; get one back from the HttpOnly refresh cookie.
void restoreSession();
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
