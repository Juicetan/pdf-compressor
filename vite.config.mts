import { defineConfig } from 'vite'
import path from 'node:path';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        open: 'example/index.html',
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
            // input: path.resolve(__dirname, 'src/index.js'),
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                // Все чанки пишем в один файл
                manualChunks() {
                    return 'index.js';
                }
            },
        },
    },
    esbuild: {
        target: "esnext",
    },
    optimizeDeps:{
        esbuildOptions: {
            target: "esnext",
        },
    },
    plugins: [
        dts({ include: ['src'] }),
        nodePolyfills(),
    ],
    // Node.js global to browser globalThis
    define: {
        global: 'globalThis',
    },
})
