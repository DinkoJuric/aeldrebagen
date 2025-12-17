import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Mock virtual:pwa-register/react for tests (doesn't exist in test env)
            'virtual:pwa-register/react': path.resolve(__dirname, './src/test/mocks/pwa-register.js'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: ['node_modules/', 'src/test/'],
        },
    },
})

