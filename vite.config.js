import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Two pages: the home page and /about/. Both load the same app.
    rolldownOptions: {
      input: {
        main: 'index.html',
        about: 'about/index.html',
      },
    },
  },
})
