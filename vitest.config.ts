import { defineConfig } from 'vitest/config'
import { UserConfig } from 'vitest';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'lcov'],
        },
    } as UserConfig,
})