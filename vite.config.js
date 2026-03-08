import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/mi-equipo-pro-frontend/',
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
})