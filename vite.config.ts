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
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['canvas-confetti', 'clsx', 'tailwind-merge'],
          'vendor-qrcode': ['html5-qrcode', 'qrcode.react'],
        },
      },
    },
  },
});
