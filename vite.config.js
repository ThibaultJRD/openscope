import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import eslint from 'vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  // Configuration des chemins
  root: './src',
  publicDir: '../assets',
  
  // Configuration du build
  build: {
    outDir: '../public',
    emptyOutDir: false,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/scripts/client/[name].min.js',
        chunkFileNames: 'assets/scripts/client/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return 'assets/style/[name].min.[ext]';
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  },

  // Configuration pour définir les globals
  define: {
    global: 'globalThis',
  },

  // Configuration du serveur de développement
  server: {
    port: 3003,
    proxy: {
      // Proxy vers le serveur Express si nécessaire
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  },

  // Configuration des plugins
  plugins: [
    // Support des navigateurs legacy (IE11+)
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),

    // Support ESLint (désactivé en production pour éviter les erreurs du code existant)
    ...(process.env.NODE_ENV !== 'production' ? [eslint({
      include: ['src/**/*.js']
    })] : [])
  ],

  // Configuration des résolutions de modules
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@scripts': path.resolve(__dirname, 'src/assets/scripts'),
      '@styles': path.resolve(__dirname, 'src/assets/style')
    }
  },

  // Configuration CSS
  css: {
    preprocessorOptions: {
      less: {
        // Options LESS si nécessaires
        javascriptEnabled: true
      }
    }
  }
});