import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to force exit the build process on Vercel
const ClosePlugin = () => ({
  name: 'ClosePlugin',
  closeBundle() {
    // Only exit if we are in a CI/Vercel environment
    if (process.env.VERCEL || process.env.CI) {
      console.log('Build complete. Force exiting process...');
      setTimeout(() => process.exit(0), 100);
    }
  },
});

export default defineConfig({
  plugins: [react(), ClosePlugin()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
