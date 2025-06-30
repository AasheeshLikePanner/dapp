import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), NodePolyfillPlugin()],
})
