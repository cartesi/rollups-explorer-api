import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Logger } from '@subsquid/logger';
import { Store } from '@subsquid/typeorm-store';
import { vi } from 'vitest';
import { events as MarketplaceEvents } from '../../src/abi/Marketplace';
import { events as ValidatorNodeProviderEvents } from '../../src/abi/ValidatorNodeProvider';
import { MarketplaceAddress } from '../../src/config';
import { ValidatorNodeProvider } from '../../src/model';

export const TokenAddress =
    '0xE15E2ADD14c26b9ae1E735bF5B444CCB11B0bd15'.toLowerCase();
export const PayeeAddress =
    '0xd8464d1B3592b6c3786B32931E2a2AdAC501Aaad'.toLowerCase();
export const AuthorityAddress =
    '0x83E4283F7eAB201b06F749F683f27CfDA294ab81'.toLowerCase();
export const ValidatorNodeProviderAddress =
    '0x4d22c1F970574ae7B8724457D268D41E6459E288'.toLowerCase();

export const validatorNodeProvider = {
    id: ValidatorNodeProviderAddress,
    authority: { id: AuthorityAddress },
    payee: PayeeAddress,
    token: {
        id: TokenAddress,
        decimals: 18,
        name: 'SunodoToken',
        symbol: 'SUN',
    },
    price: 400000000000000n,
    paused: false,
    nodes: [],
} satisfies ValidatorNodeProvider;

export const Logs = {
    paused: {
        id: '0004867730-000035-2c78f',
        address: ValidatorNodeProviderAddress,
        logIndex: 129,
        transactionIndex: 24,
        topics: [ValidatorNodeProviderEvents.Paused.topic],
        data: '0x',
        getTransaction() {
            return this.transaction;
        },
        block: {
            id: '0004867730-2c78f',
            height: 4867730,
            hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
            parentHash:
                '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
            timestamp: 1702321200000,
        },
        transaction: {
            id: '0004867730-000024-2c78f',
            transactionIndex: 24,
            from: '0xd8464d1b3592b6c3786b32931e2a2adac501aaad',
            to: ValidatorNodeProviderAddress,
            hash: '0xa4fd02a167a6a4a876283aa682febe6502278be2a2882d99a2d31e52bd3e5a52',
            block: {
                id: '0004867730-2c78f',
                height: 4867730,
                hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
                parentHash:
                    '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
                timestamp: 1702321200000,
            },
            logs: [],
            traces: [],
            stateDiffs: [],
        },
    },
    unpaused: {
        id: '0004867730-000035-2c78f',
        address: ValidatorNodeProviderAddress,
        logIndex: 129,
        transactionIndex: 24,
        topics: [ValidatorNodeProviderEvents.Unpaused.topic],
        data: '0x',
        getTransaction() {
            return this.transaction;
        },
        block: {
            id: '0004867730-2c78f',
            height: 4867730,
            hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
            parentHash:
                '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
            timestamp: 1702321200000,
        },
        transaction: {
            id: '0004867730-000024-2c78f',
            transactionIndex: 24,
            from: '0xd8464d1b3592b6c3786b32931e2a2adac501aaad',
            to: ValidatorNodeProviderAddress,
            hash: '0xa4fd02a167a6a4a876283aa682febe6502278be2a2882d99a2d31e52bd3e5a52',
            block: {
                id: '0004867730-2c78f',
                height: 4867730,
                hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
                parentHash:
                    '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
                timestamp: 1702321200000,
            },
            logs: [],
            traces: [],
            stateDiffs: [],
        },
    },
    created: {
        id: '0004867730-000035-2c78f',
        address: MarketplaceAddress,
        logIndex: 129,
        transactionIndex: 24,
        topics: [MarketplaceEvents.ValidatorNodeProviderCreated.topic],
        data: '0x0000000000000000000000004d22c1f970574ae7b8724457d268d41e6459e28800000000000000000000000083e4283f7eab201b06f749f683f27cfda294ab81000000000000000000000000e15e2add14c26b9ae1e735bf5b444ccb11b0bd15000000000000000000000000d8464d1b3592b6c3786b32931e2a2adac501aaad00000000000000000000000000000000000000000000000000016bcc41e90000',
        getTransaction() {
            return this.transaction;
        },
        block: {
            id: '0004867730-2c78f',
            height: 4867730,
            hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
            parentHash:
                '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
            timestamp: 1702321200000,
        },
        transaction: {
            id: '0004867730-000024-2c78f',
            transactionIndex: 24,
            from: '0xd8464d1b3592b6c3786b32931e2a2adac501aaad',
            to: MarketplaceAddress,
            hash: '0xa4fd02a167a6a4a876283aa682febe6502278be2a2882d99a2d31e52bd3e5a52',
            block: {
                id: '0004867730-2c78f',
                height: 4867730,
                hash: '0x8f998edf202fe3449e61849c2207432833721d9e6a5ffda1c5388187826ac9a7',
                parentHash:
                    '0x91f4d079445be915f9a9226a05a6c33a9112dda3cd10cffa4fe28406975220c6',
                timestamp: 1702321200000,
            },
            logs: [],
            traces: [],
            stateDiffs: [],
        },
    },
} satisfies Record<string, Log>;

export const blockData = {
    header: {
        id: '1234567890',
        height: 12345,
        hash: '0x1234567890abcdef',
        parentHash: '0xabcdef1234567890', // EvmBlock field
        timestamp: 1632297600, // EvmBlock field
    },
    transactions: [],
    logs: Object.values(Logs),
    traces: [],
    stateDiffs: [],
} satisfies BlockData;

const ctxBuilder = (block: BlockData): DataHandlerContext<Store> => {
    const consoleSink = vi.fn();
    const em = vi.fn();
    const logger = new Logger(consoleSink, 'app');
    const store = new Store(em);

    return {
        log: logger,
        store: store,
        blocks: [blockData],
        isHead: false,
        _chain: { client: { call: vi.fn(), batchCall: vi.fn() } },
    };
};

export const ctx = ctxBuilder(blockData);
