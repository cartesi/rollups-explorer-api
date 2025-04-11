import {
    anvil,
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    cannon,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';
import {
    loadChainsToIndexFromEnvironment,
    supportedChains,
} from '../src/utils';

describe('Utility functions', () => {
    it('should list the supported chains', () => {
        expect(Array.from(supportedChains.values())).toStrictEqual([
            mainnet.id,
            sepolia.id,
            anvil.id,
            cannon.id,
            base.id,
            baseSepolia.id,
            optimism.id,
            optimismSepolia.id,
            arbitrum.id,
            arbitrumSepolia.id,
        ]);
    });
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

        it('should returned all supported chains when set on environment variable', () => {
            vi.stubEnv(
                'CHAIN_IDS',
                '11155111, 1, 10, 8453, 84532, 11155420, 42161, 421614, 13370',
            );

            expect(loadChainsToIndexFromEnvironment()).toStrictEqual({
                chains: [
                    11155111, 1, 10, 8453, 84532, 11155420, 42161, 421614,
                    13370,
                ],
                usingDefault: false,
            });
        });
    });
});
