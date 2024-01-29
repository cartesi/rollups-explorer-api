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
import { loadApplications, loadProviders } from './utils';

export type NetworkConfig = {
    archive: string;
    rpcUrl: string;
};

function setLogsForProviders<R extends EvmBatchProcessor>(
    processor: R,
    chainId: number,
): R {
    const providersMetadata = loadProviders(chainId);
    const config = getConfig(chainId);
    const addressesCount =
        providersMetadata?.addresses[MarketplaceAddress].length ?? 0;

    const topic0 = [
        ValidatorNodeProviderEvents.MachineLocation.topic,
        ValidatorNodeProviderEvents.FinancialRunway.topic,
        ValidatorNodeProviderEvents.Paused.topic,
        ValidatorNodeProviderEvents.Unpaused.topic,
    ];

    if (providersMetadata !== null && addressesCount > 0) {
        return processor
            .addLog({
                address: providersMetadata.addresses[MarketplaceAddress],
                topic0,
                range: { from: config.from, to: providersMetadata.height },
                transaction: true,
            })
            .addLog({
                topic0,
                range: { from: providersMetadata.height + 1 },
                transaction: true,
            });
    } else {
        return processor.addLog({
            topic0,
            transaction: true,
        });
    }
}

function setLogsForApplications<R extends EvmBatchProcessor>(
    processor: R,
    chainId: number,
): R {
    const applicationMetadata = loadApplications(chainId);
    const config = getConfig(chainId);
    const addressesCount =
        applicationMetadata?.addresses[CartesiDAppFactoryAddress].length ?? 0;

    if (applicationMetadata !== null && addressesCount > 0) {
        return processor
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
        return processor.addLog({
            topic0: [CartesiDApp.OwnershipTransferred.topic],
            transaction: true,
        });
    }
}

export const createProcessor = (chainId: number): EvmBatchProcessor => {
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
        });

    processor = setLogsForProviders(processor, chainId);

    processor = config.settings.gateway
        ? processor.setGateway(config.settings.gateway)
        : processor;

    processor = setLogsForApplications(processor, chainId);

    return processor;
};

export type Fields = EvmBatchProcessorFields<typeof EvmBatchProcessor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
