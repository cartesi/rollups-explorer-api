import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'lcov'],
            include: ['**/src'],
            exclude: [
                '**/abi/**',
                '**/model/**',
                '**/src/main.ts',
                '**/handler.ts',
                '**/EventHandler.ts',
            ],
        },
    },
});
