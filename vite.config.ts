import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    sourcemap: true,
    // Optimize for production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    },
    // Ensure CSS is properly processed
    cssCodeSplit: true,
    target: 'es2015'
  },
  css: {
    postcss: './postcss.config.cjs' // Explicitly point to postcss.config.cjs
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true
    },
    // Use default file watching behavior
    watch: {
      usePolling: false,
    },
    headers: {
      // Remove CSP from Vite config to avoid conflicts - use index.html CSP instead
    }
  }
}) 