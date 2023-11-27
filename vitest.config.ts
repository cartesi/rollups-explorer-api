import { UserConfig } from 'vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'lcov'],
            exclude: ['src/abi', 'src/model', 'tests/'],
        },
    } as UserConfig,
});
