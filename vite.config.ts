import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://w2jmoe.github.io/Pause_Demo/
export default defineConfig({
  base: '/Pause_Demo/',
  plugins: [react()],
})
