import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración específica para producción
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar React y React-DOM
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Separar librerías de UI
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-libs';
          }
          // Separar Three.js y componentes pesados
          if (id.includes('node_modules/three') || 
              id.includes('node_modules/@react-three') ||
              id.includes('components/organisms/Dither')) {
            return 'three-components';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'global': 'globalThis'
  }
}); 