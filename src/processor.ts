import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor';
import {
    CartesiDAppFactoryAddress,
    Event,
    InputBoxAddress,
    getConfig,
} from './config';

export type NetworkConfig = {
    archive: string;
    rpcUrl: string;
};

export const createProcessor = (chainId: number): EvmBatchProcessor => {
    const config = getConfig(chainId);
    const processor = new EvmBatchProcessor()
        .setDataSource(config.dataSource)
        .setFinalityConfirmation(config.finalityConfirmation ?? 10)
        .setFields({
            transaction: {
                chainId: true,
                from: true,
                value: true,
                hash: true,
            },
        })
        .setBlockRange({
            from: config.from,
        })
        .addLog({
            address: [CartesiDAppFactoryAddress],
            topic0: [Event.CartesiDAppFactory.ApplicationCreated],
        })
        .addLog({
            address: [InputBoxAddress],
            topic0: [Event.InputBox.InputAdded],
            transaction: true,
        });
    return processor;
};

export type Fields = EvmBatchProcessorFields<typeof EvmBatchProcessor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
