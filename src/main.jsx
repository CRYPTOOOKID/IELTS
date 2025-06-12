import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import the timer context
import { TimerProvider } from './lib/TimerContext.jsx'

// Import the auth context
import { AuthProvider } from './components/Auth/AuthContext.jsx'

// Import the global logger
import './utils/globalLogger.js'

// AGGRESSIVE service worker cleanup for development
if (import.meta.env.DEV) {
  // Immediately unregister all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister().then(success => {
          if (success) {
            console.log('🗑️ Unregistered service worker:', registration.scope);
          }
        });
      });
    });
    
    // Clear all caches created by service workers
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName).then(success => {
            if (success) {
              console.log('🗑️ Deleted cache:', cacheName);
            }
          });
        });
      });
    }
  }
  
  // Add global cache clearing function
  window.clearAppCache = () => {
    console.log('🗑️ Clearing all browser cache...');
    
    // Clear all storage
    if (typeof Storage !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
    
    // Force reload without cache
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  };
  
  // Add keyboard shortcut: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      console.log('🔄 Force refresh triggered by keyboard shortcut');
      window.clearAppCache();
    }
  });
  
  // Add development info to console
  console.log('🚀 Development mode active');
  console.log('💡 Use Ctrl+Shift+R (or Cmd+Shift+R) to force clear cache and reload');
  console.log('💡 Or call window.clearAppCache() in console');
  console.log('⚠️ Service Worker aggressively disabled in development mode');
  console.log('🛡️ No offline messages should appear');
}

// Amplify is configured in AuthContext.jsx

// Service Worker: COMPLETELY DISABLED in development, only enabled in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)