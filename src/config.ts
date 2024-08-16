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
import mainnet from '@cartesi/rollups/export/abi/mainnet.json';
import { GatewaySettings, RpcEndpointSettings } from '@subsquid/evm-processor';
import { base, baseSepolia, optimism, optimismSepolia } from 'viem/chains';
import { archiveNodes } from './gateways';
import { parseIntOr } from './utils';

// addresses are the same on all chains
export const CartesiDAppFactoryAddress =
    mainnet.contracts.CartesiDAppFactory.address.toLowerCase();
export const ERC20PortalAddress =
    mainnet.contracts.ERC20Portal.address.toLowerCase();
export const InputBoxAddress = mainnet.contracts.InputBox.address.toLowerCase();
export const ERC721PortalAddress =
    mainnet.contracts.ERC721Portal.address.toLowerCase();
export const ERC1155SinglePortalAddress =
    mainnet.contracts.ERC1155SinglePortal.address.toLowerCase();
export const ERC1155BatchPortalAddress =
    mainnet.contracts.ERC1155BatchPortal.address.toLowerCase();
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
        case 1: // mainnet
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
            };
        case 11155111: // sepolia
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
            };
        case 10: //Optimism-Mainnet
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
            };
        case 11155420: //Optimism-Sepolia
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
            };
        case 8453: //Base-Mainnet
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
            };
        case 84532: //Base-Sepolia
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
            };
        case 31337: // anvil
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
            };
        default:
            throw new Error(`Unsupported chainId: ${chainId}`);
    }
};
