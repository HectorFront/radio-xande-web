import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite"
import path from "path";

export default defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    assetsInclude: ['**/*.xlsx'],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: './index.html',
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    logLevel: 'info'
});