import { describe, expect, it, vi } from 'vitest';
import { loadChainsToIndexFromEnvironment } from '../src/utils';

describe('Utility functions', () => {
    describe('Environment Loader for Chains', () => {
        it('should return foundry as default chain when no chains are defined from environment to be indexed', () => {
            vi.stubEnv('CHAIN_IDS', '');
            const result = loadChainsToIndexFromEnvironment();
            expect(result).toEqual({
                chains: [31337],
                usingDefault: true,
            });
        });

        it('should return only valid defined chains to be indexed i.e. supported chains', () => {
            vi.stubEnv('CHAIN_IDS', '11155111, 1, 10, non-sense, random');
            expect(loadChainsToIndexFromEnvironment()).toEqual({
                chains: [11155111, 1, 10],
                usingDefault: false,
            });
        });

        it('should dedupe valid defined chains', () => {
            vi.stubEnv('CHAIN_IDS', '11155111,1,10,10,1');
            expect(loadChainsToIndexFromEnvironment()).toEqual({
                chains: [11155111, 1, 10],
                usingDefault: false,
            });
        });
    });
});
