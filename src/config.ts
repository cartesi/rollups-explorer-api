import CartesiDAppFactoryArbitrum from '@cartesi/rollups/deployments/arbitrum/CartesiDAppFactory.json';
import InputBoxArbitrum from '@cartesi/rollups/deployments/arbitrum/InputBox.json';
import CartesiDAppFactoryArbitrumSepolia from '@cartesi/rollups/deployments/arbitrum_sepolia/CartesiDAppFactory.json';
import InputBoxArbitrumSepolia from '@cartesi/rollups/deployments/arbitrum_sepolia/InputBox.json';
import CartesiDAppFactoryBase from '@cartesi/rollups/deployments/base/CartesiDAppFactory.json';
import inputBoxBase from '@cartesi/rollups/deployments/base/InputBox.json';
import CartesiDAppFactoryBaseSepolia from '@cartesi/rollups/deployments/base_sepolia/CartesiDAppFactory.json';
import InputBoxBaseSepolia from '@cartesi/rollups/deployments/base_sepolia/InputBox.json';
import CartesiDAppFactoryMainnet from '@cartesi/rollups/deployments/mainnet/CartesiDAppFactory.json';
import InputBoxMainnet from '@cartesi/rollups/deployments/mainnet/InputBox.json';
import CartesiDAppFactoryOptimism from '@cartesi/rollups/deployments/optimism/CartesiDAppFactory.json';
import InputBoxOptimism from '@cartesi/rollups/deployments/optimism/InputBox.json';
import CartesiDAppFactoryOptimismSepolia from '@cartesi/rollups/deployments/optimism_sepolia/CartesiDAppFactory.json';
import InputBoxOptimismSepolia from '@cartesi/rollups/deployments/optimism_sepolia/InputBox.json';
import CartesiDAppFactorySepolia from '@cartesi/rollups/deployments/sepolia/CartesiDAppFactory.json';
import InputBoxSepolia from '@cartesi/rollups/deployments/sepolia/InputBox.json';
import rollupsMainnet from '@cartesi/rollups/export/abi/mainnet.json';
import { GatewaySettings, RpcEndpointSettings } from '@subsquid/evm-processor';
import { Hex } from 'viem';
import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    cannon,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from 'viem/chains';
import { contracts as SepoliaContracts } from './deployments/11155111/contracts.json';
import { contracts as OptSepoliaContracts } from './deployments/11155420/contracts.json';
import { contracts as CannonContracts } from './deployments/13370/contracts.json';
import { contracts as ArbSepoliaContracts } from './deployments/421614/contracts.json';
import { contracts as BaseSepoliaContracts } from './deployments/84532/contracts.json';
import { contracts as MainnetContracts } from './deployments/1/contracts.json';
import { contracts as OptimismContracts } from './deployments/10/contracts.json';
import { contracts as BaseContracts } from './deployments/8453/contracts.json';
import { contracts as ArbitrumContracts } from './deployments/42161/contracts.json';
import { archiveNodes } from './gateways';
import { parseIntOr, smallerOf } from './utils';

// addresses from deployment/13370. (Probably) the addresses will be the same on all chains
type RollupContractName = keyof typeof CannonContracts;
type ContractAddress = { [k in RollupContractName]: Hex };

const v2 = Object.entries(CannonContracts).reduce(
    (prev, [name, value]): ContractAddress => ({
        ...prev,
        [name]: value.address.toLowerCase(),
    }),
    {} as ContractAddress,
);

/**
 * Rollups contracts address by version.
 */
export const RollupsAddressBook = {
    v2,
} as const;

// addresses are the same on all chains
export const CartesiDAppFactoryAddress =
    rollupsMainnet.contracts.CartesiDAppFactory.address.toLowerCase();
export const ERC20PortalAddress =
    rollupsMainnet.contracts.ERC20Portal.address.toLowerCase();
export const InputBoxAddress =
    rollupsMainnet.contracts.InputBox.address.toLowerCase();
export const ERC721PortalAddress =
    rollupsMainnet.contracts.ERC721Portal.address.toLowerCase();
export const ERC1155SinglePortalAddress =
    rollupsMainnet.contracts.ERC1155SinglePortal.address.toLowerCase();
export const ERC1155BatchPortalAddress =
    rollupsMainnet.contracts.ERC1155BatchPortal.address.toLowerCase();
interface ArchiveDataSource {
    archive: string | GatewaySettings;
    rpcEndpoint?: string | RpcEndpointSettings;
}
interface RpcDataSource {
    archive?: undefined;
    rpcEndpoint: string | RpcEndpointSettings;
}

type DataSources = ArchiveDataSource | RpcDataSource;

export type ProcessorConfig = {
    dataSource: DataSources;
    from: number;
    finalityConfirmation?: number;
    v2?: {
        from: number;
    };
};

const FINALITY_CONFIRMATION = 10 as const;
const LOCAL_GENESIS_BLOCK = 22 as const;

export const getConfig = (chainId: number): ProcessorConfig => {
    const RPC_URL = `RPC_URL_${chainId}`;
    const GENESIS_BLOCK = `GENESIS_BLOCK_${chainId}`;
    const BLOCK_CONFIRMATIONS = `BLOCK_CONFIRMATIONS_${chainId}`;
    const parsedRateLimit = parseIntOr({
        value: process.env[`RPC_RATE_LIMIT_${chainId}`],
        defaultVal: 0,
    });
    const rateLimit = parsedRateLimit <= 0 ? undefined : parsedRateLimit;

    switch (chainId) {
        case mainnet.id:
            return {
                dataSource: {
                    archive: archiveNodes.mainnet,
                    rpcEndpoint: {
                        url: process.env[RPC_URL] ?? 'https://rpc.ankr.com/eth',
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryMainnet.receipt.blockNumber,
                    InputBoxMainnet.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        MainnetContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        MainnetContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case sepolia.id:
            return {
                dataSource: {
                    archive: archiveNodes.sepolia,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            'https://rpc.ankr.com/eth_sepolia',
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactorySepolia.receipt.blockNumber,
                    InputBoxSepolia.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        SepoliaContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        SepoliaContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case optimism.id:
            return {
                dataSource: {
                    archive: archiveNodes.optimism,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            optimism.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryOptimism.receipt.blockNumber,
                    InputBoxOptimism.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        OptimismContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        OptimismContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case optimismSepolia.id: //Optimism-Sepolia
            return {
                dataSource: {
                    archive: archiveNodes.optimismSepolia,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            optimismSepolia.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryOptimismSepolia.receipt.blockNumber,
                    InputBoxOptimismSepolia.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        OptSepoliaContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        OptSepoliaContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case base.id:
            return {
                dataSource: {
                    archive: archiveNodes.base,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            base.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryBase.receipt.blockNumber,
                    inputBoxBase.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        BaseContracts.ApplicationFactory.deployTxnBlockNumber,
                        BaseContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case baseSepolia.id:
            return {
                dataSource: {
                    archive: archiveNodes.baseSepolia,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            baseSepolia.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryBaseSepolia.receipt.blockNumber,
                    InputBoxBaseSepolia.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        BaseSepoliaContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        BaseSepoliaContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case arbitrum.id:
            return {
                dataSource: {
                    archive: archiveNodes.arbitrum,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            arbitrum.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryArbitrum.receipt.blockNumber,
                    InputBoxArbitrum.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        ArbitrumContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        ArbitrumContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case arbitrumSepolia.id:
            return {
                dataSource: {
                    archive: archiveNodes.arbitrumSepolia,
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            arbitrumSepolia.rpcUrls.default.http[0],
                        rateLimit: rateLimit,
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryArbitrumSepolia.receipt.blockNumber,
                    InputBoxArbitrumSepolia.receipt.blockNumber,
                ),
                finalityConfirmation: parseIntOr({
                    defaultVal: FINALITY_CONFIRMATION,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: smallerOf([
                        ArbSepoliaContracts.ApplicationFactory
                            .deployTxnBlockNumber,
                        ArbSepoliaContracts.InputBox.deployTxnBlockNumber,
                    ]),
                },
            };
        case cannon.id:
        case foundry.id:
            return {
                dataSource: {
                    rpcEndpoint:
                        process.env[RPC_URL] ?? 'http://127.0.0.1:8545',
                },
                from: parseIntOr({
                    defaultVal: LOCAL_GENESIS_BLOCK,
                    value: process.env[GENESIS_BLOCK],
                }),
                finalityConfirmation: parseIntOr({
                    defaultVal: 1,
                    value: process.env[BLOCK_CONFIRMATIONS],
                }),
                v2: {
                    from: parseIntOr({
                        defaultVal: LOCAL_GENESIS_BLOCK,
                        value: process.env[GENESIS_BLOCK],
                    }),
                },
            };
        default:
            throw new Error(`Unsupported chainId: ${chainId}`);
    }
};
