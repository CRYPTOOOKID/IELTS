import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  build: {
    sourcemap: true
  },
  server: {
    hmr: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    // Use default file watching behavior
    watch: {
      usePolling: false,
    },
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';"
    }
  }
});