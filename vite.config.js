import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to silence trivial warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put Node Modules in their own chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});