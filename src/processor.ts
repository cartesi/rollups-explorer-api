import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { events as AuthorityFactoryEvents } from './abi/AuthorityFactory';
import { events as CartesiDApp } from './abi/CartesiDApp';
import { events as CartesiDAppFactory } from './abi/CartesiDAppFactory';
import { events as InputBox } from './abi/InputBox';
import { events as MarketplaceEvents } from './abi/Marketplace';
import { events as ValidatorNodeProviderEvents } from './abi/ValidatorNodeProvider';
import {
    AuthorityFactoryAddress,
    CartesiDAppFactoryAddress,
    InputBoxAddress,
    MarketplaceAddress,
    getConfig,
} from './config';
import { loadApplications } from './utils';

export type NetworkConfig = {
    archive: string;
    rpcUrl: string;
};

export const createProcessor = (chainId: number): EvmBatchProcessor => {
    const applicationMetadata = loadApplications(chainId);
    const config = getConfig(chainId);
    let processor = new EvmBatchProcessor()
        .setRpcEndpoint(config.settings.rpcEndpoint)
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
        })
        .addLog({
            address: [AuthorityFactoryAddress],
            topic0: [AuthorityFactoryEvents.AuthorityCreated.topic],
        })
        .addLog({
            address: [MarketplaceAddress],
            topic0: [MarketplaceEvents.ValidatorNodeProviderCreated.topic],
        })
        .addLog({
            topic0: [ValidatorNodeProviderEvents.MachineLocation.topic],
            transaction: true,
        })
        .addLog({
            topic0: [ValidatorNodeProviderEvents.FinancialRunway.topic],
            transaction: true,
        })
        .addLog({
            topic0: [ValidatorNodeProviderEvents.Paused.topic],
            transaction: true,
        })
        .addLog({
            topic0: [ValidatorNodeProviderEvents.Unpaused.topic],
            transaction: true,
        });

    processor = config.settings.gateway
        ? processor.setGateway(config.settings.gateway)
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

export type Fields = EvmBatchProcessorFields<typeof EvmBatchProcessor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
