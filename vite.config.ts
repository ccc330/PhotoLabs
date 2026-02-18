import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/services': path.resolve(__dirname, 'src/services'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/constants': path.resolve(__dirname, 'src/constants'),
        '@/utils': path.resolve(__dirname, 'src/utils')
      }
    }
});
