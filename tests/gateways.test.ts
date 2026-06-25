import { afterEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { archiveNodes, getArchiveGateway } from '../src/gateways';

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

    describe('getArchiveGateway', () => {
        afterEach(() => {
            vi.unstubAllEnvs();
        });

        it('should throw an error if the ARCHIVE_GATEWAY_API_KEY environment variable is not set', () => {
            const originalEnv = process.env.ARCHIVE_GATEWAY_API_KEY;
            delete process.env.ARCHIVE_GATEWAY_API_KEY;

            try {
                getArchiveGateway('mainnet');
                throw new Error('Expected getArchiveGateway to throw an error');
            } catch (error) {
                expect((error as Error).message).toEqual(
                    'Required ARCHIVE_GATEWAY_API_KEY environment variable is not set.',
                );
            } finally {
                process.env.ARCHIVE_GATEWAY_API_KEY = originalEnv;
            }
        });

        it('should return the correct gateway settings for a supported network', () => {
            const apiKey = 'test-api-key';
            vi.stubEnv('ARCHIVE_GATEWAY_API_KEY', apiKey);

            Object.entries(archiveNodes).forEach(([network, url]) => {
                const gatewaySettings = getArchiveGateway(
                    network as keyof typeof archiveNodes,
                );
                expect(gatewaySettings).toEqual({
                    url,
                    apiKey,
                });
            });
        });

        describe('Runtime errors', () => {
            it('should throw an error if the archive requested is not supported', () => {
                const apiKey = 'test-api-key';
                vi.stubEnv('ARCHIVE_GATEWAY_API_KEY', apiKey);

                try {
                    // @ts-expect-error: Testing unsupported network
                    getArchiveGateway('lemonade');
                    throw new Error(
                        'Expected getArchiveGateway to throw an error',
                    );
                } catch (error) {
                    expect((error as Error).message).toEqual(
                        `Unsupported gateway: lemonade.\nSupported archive gateways: ${Object.keys(archiveNodes).join(', ')}`,
                    );
                }
            });
        });
    });
});
