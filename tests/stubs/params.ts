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

export const block = {
    header: {
        id: '1234567890',
        height: 12345,
        hash: '0x1234567890abcdef',
        parentHash: '0xabcdef1234567890', // EvmBlock field
        timestamp: 1632297600, // EvmBlock field
    },
    transactions: [],
    logs: [],
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
const log = new Logger(consoleSink, 'app');
export const ctx = {
    _chain: {} as unknown as Chain,
    log: log,
    store: vi.fn() as unknown as Store,
    blocks: [block],
    isHead: false,
};
