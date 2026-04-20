import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'happy-dom',
            include: ['tests/**/*.test.ts'],
            setupFiles: ['./tests/setup.ts'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html'],
                include: ['src/**/*.{ts,vue}'],
                exclude: ['src/index.ts', 'src/index.types.ts', 'src/vue-shim.d.ts']
            }
        }
    })
);
