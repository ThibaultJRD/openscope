import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import eslint from 'vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  // Path configuration
  root: './src',
  publicDir: '../assets',
  
  // Build configuration
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

  // Global definitions configuration
  define: {
    global: 'globalThis',
  },

  // Development server configuration
  server: {
    port: 3003,
    proxy: {
      // Proxy to Express server if needed
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  },

  // Plugins configuration
  plugins: [
    // Legacy browser support (IE11+)
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),

    // ESLint support (disabled in production to avoid existing code errors)
    ...(process.env.NODE_ENV !== 'production' ? [eslint({
      include: ['src/**/*.js']
    })] : [])
  ],

  // Module resolution configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@scripts': path.resolve(__dirname, 'src/assets/scripts'),
      '@styles': path.resolve(__dirname, 'src/assets/style')
    }
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      less: {
        // LESS options if needed
        javascriptEnabled: true
      }
    }
  }
});