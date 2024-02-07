import { UserConfig } from 'vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            all: false,
            reporter: ['text', 'lcov'],
            exclude: [
                'src/abi/**',
                'src/model/**',
                'tests/',
                'db/**',
                'preloaders/**',
            ],
        },
    } as UserConfig,
});
