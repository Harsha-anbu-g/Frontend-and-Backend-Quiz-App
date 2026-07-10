import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The live backend (Railway). In dev we proxy API calls through Vite so the
// browser talks same-origin (no CORS) and Vite forwards to the backend — this
// works on any dev port, unlike calling Railway directly (whose CORS only
// allows localhost:5173). Set VITE_API_BASE_URL="" so the app uses relative
// paths that these proxy rules pick up. Production builds set the real URL.
const BACKEND = 'https://frontend-and-backend-quiz-app-production.up.railway.app'

// Browsers attach an Origin header to POST/DELETE even for same-origin calls.
// If Vite forwards it, Spring's CORS filter rejects the unknown dev origin
// with 403 — so strip it and the backend treats the call as non-CORS.
const proxyRule = {
  target: BACKEND,
  changeOrigin: true,
  secure: true,
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': proxyRule,
      '/Question': proxyRule,
      '/quiz': proxyRule,
    },
  },
})
