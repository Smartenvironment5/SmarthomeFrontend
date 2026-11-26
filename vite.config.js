import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // De backend heeft (nog) geen CORS; via deze proxy praat de browser alleen met Vite.
    proxy: {
      '/api': {
        target: 'http://localhost:5100', // poort uit launchSettings.json van SmartHome.Api
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
