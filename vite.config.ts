import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// JourneyFX Workspace
// Internal Jobdesk & Project Management System
// Version 1.0.0

export default defineConfig({

  // React Configuration
  plugins: [
    react(),
  ],

  // Website Base Path
  base: '/',

  // Public Assets Directory
  publicDir: 'public',

  // Path Alias Configuration
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      ),
    },
  },

  // Development Server
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: false,
  },

  // Production Preview
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },

  // Production Build
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,

    // Production Asset Configuration
    rollupOptions: {
      output: {

        // Dependency Optimization
        manualChunks(id) {
          const path = id.replace(/\\/g, '/');

          if (!path.includes('/node_modules/')) {
            return;
          }

          if (
            /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(path)
          ) {
            return 'react-vendor';
          }

          if (path.includes('/node_modules/@supabase/')) {
            return 'supabase-vendor';
          }

          if (path.includes('/node_modules/recharts/')) {
            return 'chart-vendor';
          }

          if (
            path.includes('/node_modules/framer-motion/') ||
            path.includes('/node_modules/lucide-react/')
          ) {
            return 'ui-vendor';
          }

          if (
            path.includes('/node_modules/jspdf/') ||
            path.includes('/node_modules/jspdf-autotable/')
          ) {
            return 'pdf-vendor';
          }

          if (path.includes('/node_modules/exceljs/')) {
            return 'excel-vendor';
          }

          return undefined;
        },

        // JavaScript File Naming
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // CSS, Images and Other Assets
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },

  // Application Environment
  define: {
    __APP_NAME__: JSON.stringify('JourneyFX Workspace'),
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },

  // Terminal Configuration
  clearScreen: true,

});
