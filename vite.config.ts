import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  server: { host: '0.0.0.0', allowedHosts: true },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], restoreMocks: true, clearMocks: true },
})
