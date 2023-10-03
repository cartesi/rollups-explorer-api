import { Chain } from '@subsquid/evm-processor/lib/interfaces/chain';
import { Logger } from '@subsquid/logger';
import { Store } from '@subsquid/typeorm-store';
import { vi } from 'vitest';
import { ERC20PortalAddress } from '../../src/config';
vi.mock('@subsquid/logger', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Logger = vi.fn();
    Logger.prototype.warn = vi.fn();
    Logger.prototype.info = vi.fn();
    return {
        ...actualMods!,
        Logger,
    };
});
vi.mock('@subsquid/typeorm-store', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Store = vi.fn();
    Store.prototype.get = vi.fn();
    return {
        ...actualMods!,
        Store,
    };
});
const payload =
    '0x494e5345525420494e544f20636572746966696572202056414c554553202827307866434432423566316346353562353643306632323464614439394331346234454530393237346433272c3130202c273078664344324235663163463535623536433066323234646144393943313462344545303932373464332729';
export const input = {
    id: '0x60a7048c3136293071605a4eaffef49923e981cc-0',
    application: {
        id: '0x60a7048c3136293071605a4eaffef49923e981cc',
        owner: null,
        factory: null,
        inputs: [],
    },
    index: 1,
    msgSender: ERC20PortalAddress,
    payload: payload,
    timestamp: 1691384268 as unknown as bigint,
    blockNumber: 4040941 as unknown as bigint,
    blockHash:
        '0xce6a0d404b4201b3bd4fb8309df0b6a64f6a5d7b71fa89bf2737d4574c58b32f',
    erc20Deposit: null,
    transactionHash:
        '0x6a3d76983453c0f74188bd89e01576c35f9d9b02daecdd49f7171aeb2bd3dc78',
};

export const logs = [
    {
        id: '0004411683-000001-cae3a',
        logIndex: 1,
        transactionIndex: 1,
        address: '0x59b22d57d4f067708ab0c00552767405926dc768',
        topics: [
            '0x6aaa400068bf4ca337265e2a1e1e841f66b8597fd5b452fdc52a44bed28a0784',
            '0x0000000000000000000000000be010fa7e70d74fa8b6729fe1ae268787298f54',
            '0x0000000000000000000000000000000000000000000000000000000000000001',
        ],
        data: '0x000000000000000000000000e85fba508e9641103985e9101e5853f79d065e09000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000651b2b3c00000000000000000000000000000000000000000000000000000288e40d88a000000000000000000000000000000000000000000000000000000000651b2b3000000000000000000000000000000000000000000000000000000026dc68ca2400000000000000000000000000000000000000000000000000000000651b2b54000000000000000000000000000000000000000000000000000000002cf06118',
        block: {
            id: '0004411683-cae3a',
            height: 4411683,
            hash: '0xcae3a527a69528e4711adcb2f79bd41f1589afc909a98e8637f8c9b5e3c73b0b',
            parentHash:
                '0x4805492aba04da1f0846676cb5ddaa0d1400f0c06605ed3d83dc1cfb07e636be',
            timestamp: 1696281564000,
        },
        transaction: {
            id: '0004411683-000001-cae3a',
            transactionIndex: 1,
            from: '0x74d093f6911ac080897c3145441103dabb869307',
            hash: '0x1b165c2cd18cc58823fbe598e954458774a48f69249efed9ba5cf243b17d0d89',
            chainId: 11155111,
            value: '0',
            block: {
                id: '0004411683-cae3a',
                height: 4411683,
                hash: '0xcae3a527a69528e4711adcb2f79bd41f1589afc909a98e8637f8c9b5e3c73b0b',
                parentHash:
                    '0x4805492aba04da1f0846676cb5ddaa0d1400f0c06605ed3d83dc1cfb07e636be',
                timestamp: 1696281564000,
            },
        },
    },
    {
        id: '0004360162-000045-48ec5',
        logIndex: 45,
        transactionIndex: 47,
        address: '0xd0a1a5ca123249affbb1c1278c966ad2073ee30f',
        topics: [
            '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000005f1d00a0e5758077631b6a05e1b92ad10d05bbb4',
        ],
        data: '0x',
        block: {
            id: '0004360162-48ec5',
            height: 4360162,
            hash: '0x48ec59e44a7476f79b17756bf309592f5bfc07b8c892104c096e1f105b124e11',
            parentHash:
                '0x7432135998d062fd7509c2a6aebcd793c7035bad777c45cd304d32cf4ec3da1d',
            timestamp: 1695633264000,
        },
        transaction: {
            id: '0004360162-000047-48ec5',
            transactionIndex: 47,
            from: '0x5f1d00a0e5758077631b6a05e1b92ad10d05bbb4',
            hash: '0x12eb5747eb00ec5430f2787bd628bc22b1bb7c7e34c56a37c24b7ca95c2f293d',
            chainId: 11155111,
            value: '0',
            block: {
                id: '0004360162-48ec5',
                height: 4360162,
                hash: '0x48ec59e44a7476f79b17756bf309592f5bfc07b8c892104c096e1f105b124e11',
                parentHash:
                    '0x7432135998d062fd7509c2a6aebcd793c7035bad777c45cd304d32cf4ec3da1d',
                timestamp: 1695633264000,
            },
        },
    },
];
export const block = {
    header: {
        id: '1234567890',
        height: 12345,
        hash: '0x1234567890abcdef',
        parentHash: '0xabcdef1234567890', // EvmBlock field
        timestamp: 1632297600, // EvmBlock field
    },
    transactions: [],
    logs,
    traces: [],
    stateDiffs: [],
};
export const token = {
    decimals: 18,
    id: '0x059c7507b973d1512768c06f32a813bc93d83eb2',
    name: 'SimpleERC20',
    symbol: 'SIM20',
};
const consoleSink = vi.fn();
const em = vi.fn();
const logger = new Logger(consoleSink, 'app');
const store = new Store(em);
export const ctx = {
    _chain: {} as unknown as Chain,
    log: logger,
    store: store,
    blocks: [block],
    isHead: false,
};
