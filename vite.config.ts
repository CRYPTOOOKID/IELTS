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
      // CSP header can be quite long, ensure it's correctly formatted if kept.
      // For now, I'll keep it as is from the .mjs file.
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://xguxnr9iu0.execute-api.us-east-1.amazonaws.com https://jjsmfiikybhgha37vrlcpipu2y.appsync-api.us-east-1.amazonaws.com https://generativelanguage.googleapis.com https://api.deepseek.com https://yeo707lcq4.execute-api.us-east-1.amazonaws.com https://cognito-idp.us-east-1.amazonaws.com;",
    }
  }
}) 