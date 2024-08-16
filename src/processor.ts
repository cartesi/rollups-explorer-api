import {
    BlockData as BlockDataEvm,
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { events as CartesiDApp } from './abi/CartesiDApp';
import { events as CartesiDAppFactory } from './abi/CartesiDAppFactory';
import { events as InputBox } from './abi/InputBox';
import {
    CartesiDAppFactoryAddress,
    InputBoxAddress,
    getConfig,
} from './config';
import { loadApplications } from './utils';

export type NetworkConfig = {
    archive: string;
    rpcUrl: string;
};

export const createProcessor = (chainId: number) => {
    const applicationMetadata = loadApplications(chainId);
    const config = getConfig(chainId);
    let processor = new EvmBatchProcessor()
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
            topic0: [CartesiDAppFactory.ApplicationCreated.topic],
        })
        .addLog({
            address: [InputBoxAddress],
            topic0: [InputBox.InputAdded.topic],
            transaction: true,
        });

    processor = config.dataSource.archive
        ? processor.setGateway(config.dataSource.archive)
        : processor;

    processor = config.dataSource.rpcEndpoint
        ? processor.setRpcEndpoint(config.dataSource.rpcEndpoint)
        : processor;

    if (applicationMetadata !== null) {
        processor = processor
            .addLog({
                address:
                    applicationMetadata.addresses[CartesiDAppFactoryAddress],
                topic0: [CartesiDApp.OwnershipTransferred.topic],
                range: { from: config.from, to: applicationMetadata.height },
                transaction: true,
            })
            .addLog({
                topic0: [CartesiDApp.OwnershipTransferred.topic],
                range: { from: applicationMetadata.height + 1 },
                transaction: true,
            });
    } else {
        processor = processor.addLog({
            topic0: [CartesiDApp.OwnershipTransferred.topic],
            transaction: true,
        });
    }

    return processor;
};

export type Fields = EvmBatchProcessorFields<typeof createProcessor>;
export type Block = BlockHeader<Fields>;
export type BlockData = BlockDataEvm<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
