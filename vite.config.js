import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split heavy libraries into separate chunks
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-lib';
            }
            if (id.includes('lottie-react') || id.includes('framer-motion')) {
              return 'animations';
            }
            if (id.includes('react-icons')) {
              return 'icons';
            }
            // Put the rest in vendor
            return 'vendor';
          }
        },
      },
    },
  },
});