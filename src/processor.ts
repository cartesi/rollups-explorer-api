import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { createLogger } from '@subsquid/logger';
import {
    ProcessorConfig,
    SupportedChainId,
    SupportedNetworks,
    eventConfigs,
    networkConfigs,
    processorConfigs,
} from './configs';

const logger = createLogger('sqd:startup');
const CHAIN_ID = process.env.CHAIN_ID as SupportedChainId;
const chainId: SupportedChainId = CHAIN_ID ?? SupportedNetworks.SEPOLIA;
const [name, id] =
    Object.entries(SupportedNetworks).find(([_, id]) => id === chainId) ?? [];

export const config = networkConfigs[chainId];
const processorConfig: ProcessorConfig = processorConfigs.get(chainId) ?? {};

if (!CHAIN_ID) {
    logger.warn(`Environment variable CHAIN_ID not defined.`);
}

logger.info(`Using chain-id:${id} network name: ${name}`);

logger.info(
    `RPC-configured: ${config.chain} Archive-node configured: ${config.archive}`,
);

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: config.archive,
        chain: {
            url: config.chain ?? '',
            rateLimit: processorConfig.rateLimit,
            maxBatchCallSize: processorConfig.maxBatchCallSize,
        },
    })
    .setFinalityConfirmation(10)
    .setFields({
        transaction: {
            chainId: true,
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: Math.min(
            config.cartesiDAppFactory.block,
            config.erc20Portal.block,
            config.inputBox.block,
        ),
    })
    .addLog({
        address: [config.cartesiDAppFactory.address],
        topic0: [eventConfigs.cartesiDAppFactory.applicationCreated],
    })
    .addLog({
        address: [config.inputBox.address],
        topic0: [eventConfigs.inputBox.inputAdded],
        transaction: true,
    });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
