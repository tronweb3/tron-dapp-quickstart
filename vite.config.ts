import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            include: ['buffer'],
        }),
    ],
    envPrefix: 'TDQ_',
});
