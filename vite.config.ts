import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.build.json' }), tailwindcss()],
  test: {
    environment: 'jsdom',
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', /^primevue(\/|$)/, /^@primeuix\//],
    },
  },
});
