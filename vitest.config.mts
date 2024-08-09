import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'lcov'],
            exclude: [
                '**/abi/**',
                '**/model/**',
                '**/tests/**',
                '**/db',
                'vitest.config.ts',
                '**/lib',
                '**/preloaders',
                '**/src/main.ts',
                '**/handler.ts',
                '**/EventHandler.ts',
            ],
        },
    },
});
