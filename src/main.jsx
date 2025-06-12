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

// Service Worker: Enhanced error handling and CSP protection
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Add error handling for service worker registration
    navigator.serviceWorker.register('/sw.js', {
      // Restrict scope to prevent interference with browser extensions
      scope: '/'
    })
      .then((registration) => {
        console.log('✅ SW registered successfully:', registration.scope);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available, updating...');
              // Optionally show update notification to user
            }
          });
        });
      })
      .catch((registrationError) => {
        console.warn('⚠️ SW registration failed:', registrationError);
        
        // Check if it's a CSP error
        if (registrationError.name === 'SecurityError') {
          console.warn('🛡️ Service Worker blocked by Content Security Policy');
        }
        
        // Don't throw error, just log and continue without SW
      });
    
    // Add global error handler for service worker errors
    navigator.serviceWorker.addEventListener('error', (error) => {
      console.warn('🚨 Service Worker error:', error);
    });
    
    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'CACHE_STATUS':
          console.log('📦 Cache status:', payload);
          break;
        default:
          console.log('📨 SW message:', event.data);
      }
    });
  });
  
  // Add unhandled promise rejection handler to catch SW-related errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('ServiceWorker') || 
         event.reason.message.includes('Failed to fetch'))) {
      console.warn('🔧 Handled service worker related promise rejection:', event.reason);
      event.preventDefault(); // Prevent the error from appearing in console
    }
  });
  
  // Add global error handler for Firebase auth errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.code && event.reason.code.startsWith('auth/')) {
      console.warn('🔧 Handled Firebase auth promise rejection:', event.reason);
      event.preventDefault(); // Prevent the error from appearing in console
    }
  });
  
  // Add general error handler for browser extension conflicts
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('chrome-extension') || 
         event.error.message.includes('Extension context'))) {
      console.warn('🔧 Handled browser extension error:', event.error);
      event.preventDefault(); // Prevent the error from appearing in console
      return true;
    }
  });
} else if (import.meta.env.PROD) {
  console.log('⚠️ Service Worker not supported in this browser');
  
  // Production error handlers
  window.addEventListener('unhandledrejection', (event) => {
    // Handle Firebase auth errors gracefully
    if (event.reason && event.reason.code && event.reason.code.startsWith('auth/')) {
      console.warn('Firebase auth error handled:', event.reason.code);
      event.preventDefault();
    }
    
    // Handle service worker errors gracefully
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('ServiceWorker') || 
         event.reason.message.includes('Failed to fetch'))) {
      console.warn('Service worker error handled:', event.reason.message);
      event.preventDefault();
    }
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