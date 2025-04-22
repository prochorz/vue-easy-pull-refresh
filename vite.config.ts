import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'VueEasyPullRefresh',
            fileName: (format) => `vue-easy-pull-refresh.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                inlineDynamicImports: true
            },
        }
    },
    css: {
        modules: {
            generateScopedName: '[hash:base64:5]'
        }
    },
    plugins: [
        vue(),
        cssInjectedByJsPlugin(),
        dts({
            cleanVueFileName: true,
            tsconfigPath: "./tsconfig.app.json",
            insertTypesEntry: true,
        })
    ],
})
