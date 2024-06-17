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
import { DataSource } from '@subsquid/evm-processor';
import { base, baseSepolia, optimism, optimismSepolia } from 'viem/chains';

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

export type ProcessorConfig = {
    dataSource: DataSource;
    from: number;
    finalityConfirmation?: number;
};

/**
 * Archive nodes raw gateway URLs more info {@link https://docs.subsquid.io/glossary/#archive-registry}
 *
 * To find a new URL run the following command
 * @example
 *  npm run sqd gateways ls
 */
const archiveNodes = {
    base: 'https://v2.archive.subsquid.io/network/base-mainnet',
    baseSepolia: 'https://v2.archive.subsquid.io/network/base-sepolia',
    optimism: 'https://v2.archive.subsquid.io/network/optimism-mainnet',
    optimismSepolia: 'https://v2.archive.subsquid.io/network/optimism-sepolia',
    mainnet: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    sepolia: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
} as const;

const FINALITY_CONFIRMATION = 10 as const;
const LOCAL_GENESIS_BLOCK = 22 as const;

export const getConfig = (chainId: number): ProcessorConfig => {
    const RPC_URL = `RPC_URL_${chainId}`;
    const GENESIS_BLOCK = `GENESIS_BLOCK_${chainId}`;
    const BLOCK_CONFIRMATIONS = `BLOCK_CONFIRMATIONS_${chainId}`;
    switch (chainId) {
        case 1: // mainnet
            return {
                dataSource: {
                    archive: archiveNodes.mainnet,
                    chain: process.env[RPC_URL] ?? 'https://rpc.ankr.com/eth',
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
                    chain:
                        process.env[RPC_URL] ??
                        'https://rpc.ankr.com/eth_sepolia',
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
                    chain:
                        process.env[RPC_URL] ??
                        optimism.rpcUrls.default.http[0],
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
                    chain:
                        process.env[RPC_URL] ??
                        optimismSepolia.rpcUrls.default.http[0],
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
                    chain: process.env[RPC_URL] ?? base.rpcUrls.default.http[0],
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
                    chain:
                        process.env[RPC_URL] ??
                        baseSepolia.rpcUrls.default.http[0],
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
                    chain: process.env[RPC_URL] ?? 'http://127.0.0.1:8545',
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

interface ParseIntOr {
    value?: string;
    defaultVal: number;
}

function parseIntOr({ value, defaultVal }: ParseIntOr) {
    const number = parseInt(value ?? '');
    return Number.isNaN(number) ? defaultVal : number;
}
