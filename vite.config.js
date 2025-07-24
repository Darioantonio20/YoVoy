import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
//  build: {//
//    rollupOptions: {
//      output: {
//        manualChunks: {
//          vendor: ['react', 'react-dom'],
//          three: ['three', '@react-three/fiber', '@react-three/drei'],
//          ui: ['framer-motion', 'lucide-react']
//        }
//      }
//    }
//  },
//  optimizeDeps: {
//    include: ['three', '@react-three/fiber', '@react-three/drei']
//  }
});
