import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const env = process.env.NODE_ENV || 'production';
const isDev = env !== 'production';


export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
        }
    },
    css: {
        devSourcemap: isDev,
        preprocessorOptions: {
            scss: {
                additionalData: `
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";
`,
                includePaths: [
                    'node_modules'
                ]
            }
        },
        postcss: {
            plugins: [
                autoprefixer
            ]
        }
    },
    build: {
        target: 'esnext',
        sourcemap: false,
    },
    server: {
        cors: true,
    }
});
