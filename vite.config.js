import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Three pages - the home page, /about/ and /privacy/ - all loading the
    // same app, plus /app/, a tiny "get the app" redirect (src/appRedirect.js).
    rolldownOptions: {
      input: {
        main: 'index.html',
        about: 'about/index.html',
        privacy: 'privacy/index.html',
        app: 'app/index.html',
      },
    },
  },
})
