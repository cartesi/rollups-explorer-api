import { afterEach } from 'node:test';
import { MockInstance, beforeEach, describe, expect, test, vi } from 'vitest';
import { CartesiDAppFactoryAddress } from '../src/config';
import { createProcessor } from '../src/processor';
import { loadApplications } from '../src/utils';

vi.mock('@subsquid/evm-processor', async () => {
    const actualMods = await vi.importActual('@subsquid/evm-processor');
    const EvmBatchProcessor = vi.fn();

    EvmBatchProcessor.prototype.setDataSource = vi.fn().mockReturnThis();
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

        expect(processor.setDataSource).toHaveBeenCalledWith({
            archive: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
            chain: 'https://rpc.ankr.com/eth_sepolia',
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

        const addLog = processor.addLog as unknown as MockInstance;

        expect(addLog).toHaveBeenCalledTimes(4);
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

        expect(addLog.mock.calls[3][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: { from: applicationMetadata?.height! + 1 },
            transaction: true,
        });
    });

    test('Required configs for local/anvil', () => {
        const processor = createProcessor(local);

        expect(processor.setDataSource).toHaveBeenCalledWith({
            chain: 'http://127.0.0.1:8545',
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

        const addLog = processor.addLog as unknown as MockInstance;

        expect(addLog).toHaveBeenCalledTimes(3);
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
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            transaction: true,
        });
    });

    test('Required configs for mainnet', () => {
        const processor = createProcessor(mainnet);
        const applicationMetadata = loadApplications(mainnet);

        expect(processor.setDataSource).toHaveBeenCalledWith({
            archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
            chain: 'https://rpc.ankr.com/eth',
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

        const addLog = processor.addLog as unknown as MockInstance;

        expect(addLog).toHaveBeenCalledTimes(4);
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

        expect(addLog.mock.calls[3][0]).toEqual({
            topic0: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            ],
            range: {
                from: applicationMetadata?.height! + 1,
            },
            transaction: true,
        });
    });

    test('Set correct chain for sepolia based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-sepolia-node/v3/api';
        vi.stubEnv('RPC_URL_11155111', myRPCNodeURL);

        const processor = createProcessor(sepolia);

        expect(processor.setDataSource).toHaveBeenCalledWith({
            archive: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
            chain: 'https://my-custom-sepolia-node/v3/api',
        });
    });

    test('Set correct chain for mainnet based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-mainnet-node/v3/api';
        vi.stubEnv('RPC_URL_1', myRPCNodeURL);

        const processor = createProcessor(mainnet);

        expect(processor.setDataSource).toHaveBeenCalledWith({
            archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
            chain: 'https://my-custom-mainnet-node/v3/api',
        });
    });

    test('Set correct chain for local/anvil based on environment var', () => {
        const myRPCNodeURL = 'https://my-custom-local-node:9000';
        vi.stubEnv('RPC_URL_31337', myRPCNodeURL);

        const processor = createProcessor(local);

        expect(processor.setDataSource).toHaveBeenCalledWith({
            chain: 'https://my-custom-local-node:9000',
        });
    });
});
