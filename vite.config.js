import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar el límite de advertencia a 1MB
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
          // Separar componentes pesados del Home
          if (id.includes('components/organisms/HeroSection') || 
              id.includes('components/organisms/Dither') || 
              id.includes('components/organisms/LoginForm')) {
            return 'home-components';
          }
          // Separar componentes del admin
          if (id.includes('components/admin/')) {
            return 'admin-components';
          }
          // Separar componentes de la tienda
          if (id.includes('components/organisms/ProductGrid') || 
              id.includes('components/molecules/ProductCard') || 
              id.includes('components/molecules/StoreCard')) {
            return 'store-components';
          }
          // Separar componentes del carrito
          if (id.includes('components/organisms/CartList') || 
              id.includes('components/molecules/CartItem') || 
              id.includes('components/molecules/OrderSummary') || 
              id.includes('components/molecules/OrderConfirmationModal') || 
              id.includes('components/molecules/PaymentMethodModal')) {
            return 'cart-components';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
});
