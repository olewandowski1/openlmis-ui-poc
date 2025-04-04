import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss(), TanStackRouterVite()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_FE_PORT),
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    build: {
      // Disable sourcemaps for production by default
      sourcemap: isProduction ? false : true,

      // Rollup options for advanced configuration
      rollupOptions: {
        output: {
          /**
           * Manual chunk splitting strategy.
           * Group common dependencies into separate chunks.
           */
          manualChunks(id) {
            // Group React core libraries
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/')
            ) {
              return 'react-vendor';
            }

            // Group TanStack libraries (Router, Query, etc.)
            if (id.includes('/node_modules/@tanstack/')) {
              return 'tanstack-vendor';
            }

            // Create a general vendor chunk for other node_modules
            if (id.includes('/node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
