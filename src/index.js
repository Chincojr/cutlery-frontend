import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker is registered');
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
