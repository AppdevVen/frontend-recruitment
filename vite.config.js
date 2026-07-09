import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 7060,
    open: false,
  },
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: fileURLToPath(new URL('./src/quasar-variables.sass', import.meta.url)),
    }),
  ],
});