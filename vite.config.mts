import { defineConfig } from 'vite'
import path from 'node:path';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: 'index.html',
  },
  worker: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      }
    }
  },
  build: {
    target: "esnext",
    outDir: 'dist',
    assetsDir: '',
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        lib: path.resolve(__dirname, 'src/index.ts'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        manualChunks() {
          return 'index.js';
        }
      },
    },
  },
  esbuild: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [
    dts({ include: ['src'] }),
    nodePolyfills(),
    topLevelAwait(),
  ],
  // Node.js global to browser globalThis
  define: {
    global: 'globalThis',
  },
})
