import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response?.status === 401) {
      try {
        const cloned = response.clone();
        const contentType = cloned.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const payload = await cloned.json().catch(() => null);
          const errorCode = payload?.code || payload?.error_code;
          const rawMessage = typeof payload?.error === 'string' ? payload.error.toLowerCase() : '';
          const isSessionExpired =
            errorCode === 'SESSION_EXPIRED' ||
            rawMessage.includes('session expired');

          if (isSessionExpired) {
            window.dispatchEvent(new CustomEvent('sessionExpired', {
              detail: {
                reason: 'expired',
                payload
              }
            }));
          }
        }
      } catch (fetchInterceptorError) {
        console.warn('Unable to inspect 401 response:', fetchInterceptorError);
      }
    }

    return response;
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

