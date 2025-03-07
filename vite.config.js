
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
  optimizeDeps: {
    exclude: ['@aws-amplify/core']
  },
  // Ignore source map warnings from node_modules
  server: {
    hmr: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
})