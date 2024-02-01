import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { afterEach } from 'node:test';
import { arbitrum, arbitrumGoerli } from 'viem/chains';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { events as ValidatorNodeProviderEvents } from '../src/abi/ValidatorNodeProvider';
import { CartesiDAppFactoryAddress, MarketplaceAddress } from '../src/config';
import { createProcessor } from '../src/processor';
import { loadApplications, loadProviders } from '../src/utils';

vi.mock('@subsquid/evm-processor', async () => {
    const actualMods = await vi.importActual('@subsquid/evm-processor');
    const EvmBatchProcessor = vi.fn();

    EvmBatchProcessor.prototype.setRpcEndpoint = vi.fn().mockReturnThis();
    EvmBatchProcessor.prototype.setGateway = vi.fn().mockReturnThis();
    EvmBatchProcessor.prototype.setFinalityConfirmation = vi
        .fn()
        .mockReturnThis();
    EvmBatchProcessor.prototype.setFields = vi.fn().mockReturnThis();
    EvmBatchProcessor.prototype.setBlockRange = vi.fn().mockReturnThis();
    EvmBatchProcessor.prototype.addLog = vi.fn().mockReturnThis();

    return {
        ...actualMods!,
        EvmBatchProcessor,
    };
});

const validatorNodeProviderTopics = [
    ValidatorNodeProviderEvents.MachineLocation.topic,
    ValidatorNodeProviderEvents.FinancialRunway.topic,
    ValidatorNodeProviderEvents.Paused.topic,
    ValidatorNodeProviderEvents.Unpaused.topic,
];
const sepolia = 11155111;
const mainnet = 1;
const local = 31337;

describe('Processor creation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    test('Throw error for unsupported chains', () => {
        try {
            const processor = createProcessor(999);
            expect.unreachable('Should not pass createProcessor');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('Unsupported chainId: 999');
        }
    });

    test('Required configs for sepolia', () => {
        const processor = createProcessor(sepolia);
        const applicationMetadata = loadApplications(sepolia);
        const providersMetadata = loadProviders(sepolia);

        expect(processor.setGateway).toHaveBeenCalledWith({
            url: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
        });

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://rpc.ankr.com/eth_sepolia',
        });

        expect(processor.setFinalityConfirmation).toHaveBeenCalledWith(10);
        expect(processor.setFields).toHaveBeenCalledWith({
            transaction: {
                chainId: true,
                from: true,
                hash: true,
                value: true,
            },
        });
        expect(processor.setBlockRange).toHaveBeenCalledWith({
            from: 3963384,
        });

        expect(processor.addLog).toHaveBeenCalledTimes(8);

        addLogExpectation(processor);

        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[4][0]).toEqual({
            address: providersMetadata?.addresses[MarketplaceAddress],
            range: {
                from: 3963384,
                to: providersMetadata?.height,
            },
            topic0: [
                '0x22f244e839c97faca31341c9c2bb7a09f94a81fb309a36a85c8465bafeb69ffc',
                '0x206c488a3e590d91a82467a0072d112dfe901a99ae561b30c89ff2509fadde35',
                '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258',
                '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa',
            ],
            transaction: true,
        });

        expect(addLog.mock.calls[5][0]).toEqual({
            range: {
                from: providersMetadata?.height! + 1,
            },
            topic0: [
                '0x22f244e839c97faca31341c9c2bb7a09f94a81fb309a36a85c8465bafeb69ffc',
                '0x206c488a3e590d91a82467a0072d112dfe901a99ae561b30c89ff2509fadde35',
                '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258',
                '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa',
            ],
            transaction: true,
        });

        expect(addLog.mock.calls[6][0]).toEqual({
            address: applicationMetadata?.addresses[CartesiDAppFactoryAddress],
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: expect.any(Number),
                to: applicationMetadata?.height,
            },
            transaction: true,
        });

        expect(addLog.mock.calls[7][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: applicationMetadata?.height! + 1,
            },
            transaction: true,
        });
    });

    test('Required configs for local/anvil', () => {
        const processor = createProcessor(local);

        expect(processor.setGateway).not.toHaveBeenCalled();
        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'http://127.0.0.1:8545',
        });

        expect(processor.setFinalityConfirmation).toHaveBeenCalledWith(10);
        expect(processor.setFields).toHaveBeenCalledWith({
            transaction: {
                chainId: true,
                from: true,
                hash: true,
                value: true,
            },
        });
        expect(processor.setBlockRange).toHaveBeenCalledWith({
            from: 0,
        });

        expect(processor.addLog).toHaveBeenCalledTimes(6);

        addLogExpectation(processor);

        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[4][0]).toEqual({
            topic0: [
                '0x22f244e839c97faca31341c9c2bb7a09f94a81fb309a36a85c8465bafeb69ffc',
                '0x206c488a3e590d91a82467a0072d112dfe901a99ae561b30c89ff2509fadde35',
                '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258',
                '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa',
            ],
            transaction: true,
        });

        expect(addLog.mock.calls[5][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            transaction: true,
        });
    });

    test('Required configs for mainnet', () => {
        const applicationMetadata = loadApplications(mainnet);
        const providerMetadata = loadProviders(mainnet);
        const processor = createProcessor(mainnet);

        expect(processor.setGateway).toHaveBeenCalledWith({
            url: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
        });

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://cloudflare-eth.com',
        });

        expect(processor.setFinalityConfirmation).toHaveBeenCalledWith(10);
        expect(processor.setFields).toHaveBeenCalledWith({
            transaction: {
                chainId: true,
                from: true,
                hash: true,
                value: true,
            },
        });
        expect(processor.setBlockRange).toHaveBeenCalledWith({
            from: 17784733,
        });

        expect(processor.addLog).toHaveBeenCalledTimes(7);

        addLogExpectation(processor);

        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[4][0]).toEqual({
            topic0: validatorNodeProviderTopics,
            transaction: true,
        });

        expect(addLog.mock.calls[5][0]).toEqual({
            address: applicationMetadata?.addresses[CartesiDAppFactoryAddress],
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: expect.any(Number),
                to: applicationMetadata?.height,
            },
            transaction: true,
        });

        expect(addLog.mock.calls[6][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: applicationMetadata?.height! + 1,
            },
            transaction: true,
        });
    });

    test('Required configs for arbitrum', () => {
        const applicationMetadata = loadApplications(arbitrum.id);
        const processor = createProcessor(arbitrum.id);

        expect(processor.setGateway).toHaveBeenCalledWith({
            url: 'https://v2.archive.subsquid.io/network/arbitrum-one',
        });

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://arb1.arbitrum.io/rpc',
        });

        expect(processor.setFinalityConfirmation).toHaveBeenCalledWith(10);
        expect(processor.setFields).toHaveBeenCalledWith({
            transaction: {
                chainId: true,
                from: true,
                hash: true,
                value: true,
            },
        });
        expect(processor.setBlockRange).toHaveBeenCalledWith({
            from: 115470622,
        });

        expect(processor.addLog).toHaveBeenCalledTimes(6);

        addLogExpectation(processor);

        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[4][0]).toEqual({
            topic0: validatorNodeProviderTopics,
            transaction: true,
        });

        expect(addLog.mock.calls[5][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            transaction: true,
        });
    });

    test('Required configs for arbitrum-goerli', () => {
        const applicationMetadata = loadApplications(arbitrumGoerli.id);
        const processor = createProcessor(arbitrumGoerli.id);

        expect(processor.setGateway).toHaveBeenCalledWith({
            url: 'https://v2.archive.subsquid.io/network/arbitrum-goerli',
        });

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://goerli-rollup.arbitrum.io/rpc',
        });

        expect(processor.setFinalityConfirmation).toHaveBeenCalledWith(10);
        expect(processor.setFields).toHaveBeenCalledWith({
            transaction: {
                chainId: true,
                from: true,
                hash: true,
                value: true,
            },
        });
        expect(processor.setBlockRange).toHaveBeenCalledWith({
            from: 31715663,
        });

        expect(processor.addLog).toHaveBeenCalledTimes(7);

        addLogExpectation(processor);

        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[4][0]).toEqual({
            topic0: validatorNodeProviderTopics,
            transaction: true,
        });

        expect(addLog.mock.calls[5][0]).toEqual({
            address: applicationMetadata?.addresses[CartesiDAppFactoryAddress],
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: expect.any(Number),
                to: applicationMetadata?.height,
            },
            transaction: true,
        });

        expect(addLog.mock.calls[6][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: applicationMetadata?.height! + 1,
            },
            transaction: true,
        });
    });

    test('Set correct rpc-endpoint for sepolia based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-sepolia-node/v3/api';
        vi.stubEnv('RPC_URL_11155111', myRPCNodeURL);

        const processor = createProcessor(sepolia);

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://my-custom-sepolia-node/v3/api',
        });
    });

    test('Set correct rpc-endpoint for mainnet based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-mainnet-node/v3/api';
        vi.stubEnv('RPC_URL_1', myRPCNodeURL);

        const processor = createProcessor(mainnet);

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://my-custom-mainnet-node/v3/api',
        });
    });

    test('Set correct rpc-endpoint for local/anvil based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-local-node:9000';
        vi.stubEnv('RPC_URL_31337', myRPCNodeURL);

        const processor = createProcessor(local);

        expect(processor.setRpcEndpoint).toHaveBeenCalledWith({
            url: 'https://my-custom-local-node:9000',
        });
    });

    /**
     * Common addLog expectations
     * @param processor
     */
    function addLogExpectation(processor: EvmBatchProcessor) {
        const addLog = vi.mocked(processor.addLog);

        expect(addLog.mock.calls[0][0]).toEqual({
            address: ['0x7122cd1221c20892234186facfe8615e6743ab02'],
            topic0: [
                '0xe73165c2d277daf8713fd08b40845cb6bb7a20b2b543f3d35324a475660fcebd',
            ],
        });
        expect(addLog.mock.calls[1][0]).toEqual({
            address: ['0x59b22d57d4f067708ab0c00552767405926dc768'],
            topic0: [
                '0x6aaa400068bf4ca337265e2a1e1e841f66b8597fd5b452fdc52a44bed28a0784',
            ],
            transaction: true,
        });

        expect(addLog.mock.calls[2][0]).toEqual({
            address: ['0xf26a5b278c25d8d41a136d22ad719eaced9c3e63'],
            topic0: [
                '0xdca1fad70bee4ba7a4e17a1c6e99e657d2251af7a279124758bc01588abe2d2f',
            ],
        });

        expect(addLog.mock.calls[3][0]).toEqual({
            address: ['0xb6dd5307629186a5d16611aac1a14cde9ea49f57'],
            topic0: [
                '0x0e2b88107197b560f03a59714a3b7fcced2035fc2f645c44f71491f96c003541',
            ],
        });
    }
});
