import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    target: ['es2018', 'safari13', 'ios12', 'edge88', 'firefox78', 'chrome87'],
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replace(/\\/g, '/');
          if (path.includes('node_modules/react/') || path.includes('node_modules/react-dom/')) return 'vendor-react';
          if (path.includes('node_modules/lucide-react/')) return 'vendor-icons';
          if (
            path.includes('node_modules/canvas-confetti/') ||
            path.includes('node_modules/clsx/') ||
            path.includes('node_modules/tailwind-merge/')
          ) return 'vendor-utils';
          if (path.includes('node_modules/html5-qrcode/') || path.includes('node_modules/qrcode.react/')) return 'vendor-qrcode';

          if (path.includes('/src/context/') || path.includes('/src/services/') || path.includes('/src/utils/')) {
            return 'app-data';
          }
          if (
            path.includes('/src/apps/collaborator/') ||
            path.includes('/src/components/mobile/') ||
            path.includes('/src/components/pwa/') ||
            (path.includes('/src/components/inventory/') && !path.includes('InventoryAdminBanner'))
          ) {
            return 'app-collaborator';
          }
          if (
            path.includes('/src/apps/admin/') ||
            (path.includes('/src/components/admin/') &&
              !path.includes('AdminMobileDock') &&
              !path.includes('GuidedPickingModal') &&
              !path.includes('QuickBillingSection') &&
              !path.includes('AgendaSection') &&
              !path.includes('MetricsPage'))
          ) {
            return 'app-admin';
          }
          if (
            path.includes('/src/apps/web/') ||
            path.includes('/src/components/propuesta/') ||
            (path.includes('/src/components/store/') && !path.includes('LayawayOrderCard'))
          ) {
            return 'app-web';
          }
        },
      },
    },
  },
});
