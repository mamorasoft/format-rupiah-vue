/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FormatRupiahVue',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.cjs'}`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true
    })
  ],
  test: {
    environment: 'jsdom'
  }
});
