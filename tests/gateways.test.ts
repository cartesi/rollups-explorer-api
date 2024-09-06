import { describe, expect, it } from 'vitest';
import { archiveNodes } from '../src/gateways';

describe('Gateways (Squid Archive Nodes)', () => {
    it('should have a list of all supported chains by name', () => {
        expect(Object.keys(archiveNodes)).toStrictEqual([
            'base',
            'baseSepolia',
            'optimism',
            'optimismSepolia',
            'mainnet',
            'sepolia',
            'arbitrum',
            'arbitrumSepolia',
        ]);
    });

    it('should point to the expect rpc endpoints', () => {
        expect(archiveNodes.base).toStrictEqual(
            'https://v2.archive.subsquid.io/network/base-mainnet',
        );
        expect(archiveNodes.baseSepolia).toStrictEqual(
            'https://v2.archive.subsquid.io/network/base-sepolia',
        );
        expect(archiveNodes.optimism).toStrictEqual(
            'https://v2.archive.subsquid.io/network/optimism-mainnet',
        );

        expect(archiveNodes.optimismSepolia).toStrictEqual(
            'https://v2.archive.subsquid.io/network/optimism-sepolia',
        );
        expect(archiveNodes.mainnet).toStrictEqual(
            'https://v2.archive.subsquid.io/network/ethereum-mainnet',
        );
        expect(archiveNodes.sepolia).toStrictEqual(
            'https://v2.archive.subsquid.io/network/ethereum-sepolia',
        );

        expect(archiveNodes.arbitrum).toStrictEqual(
            'https://v2.archive.subsquid.io/network/arbitrum-one',
        );

        expect(archiveNodes.arbitrumSepolia).toStrictEqual(
            'https://v2.archive.subsquid.io/network/arbitrum-sepolia',
        );
    });
});
