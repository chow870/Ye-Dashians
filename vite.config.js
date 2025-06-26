import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ye-dashians-backend.onrender.com',
        changeOrigin: true,
        secure: false, // use `false` if backend doesn't have a valid cert
      },
      '/maps': {
        target: 'https://ye-dashians-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
