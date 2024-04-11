import CartesiDAppFactoryMainnet from '@cartesi/rollups/deployments/mainnet/CartesiDAppFactory.json';
import InputBoxMainnet from '@cartesi/rollups/deployments/mainnet/InputBox.json';
import CartesiDAppFactorySepolia from '@cartesi/rollups/deployments/sepolia/CartesiDAppFactory.json';
import InputBoxSepolia from '@cartesi/rollups/deployments/sepolia/InputBox.json';
import mainnet from '@cartesi/rollups/export/abi/mainnet.json';
import { lookupArchive } from '@subsquid/archive-registry';
import { DataSource } from '@subsquid/evm-processor';

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

export const getConfig = (chainId: number): ProcessorConfig => {
    const RPC_URL = `RPC_URL_${chainId}`;
    switch (chainId) {
        case 1: // mainnet
            return {
                dataSource: {
                    archive: lookupArchive('eth-mainnet'),
                    chain: process.env[RPC_URL] ?? 'https://rpc.ankr.com/eth',
                },
                from: Math.min(
                    CartesiDAppFactoryMainnet.receipt.blockNumber,
                    InputBoxMainnet.receipt.blockNumber,
                ),
            };
        case 11155111: // sepolia
            return {
                dataSource: {
                    archive: lookupArchive('eth-sepolia'),
                    chain:
                        process.env[RPC_URL] ??
                        'https://rpc.ankr.com/eth_sepolia',
                },
                from: Math.min(
                    CartesiDAppFactorySepolia.receipt.blockNumber,
                    InputBoxSepolia.receipt.blockNumber,
                ),
            };
        case 31337: // anvil
            return {
                dataSource: {
                    chain: process.env[RPC_URL] ?? 'http://127.0.0.1:8545',
                },
                from: 0,
            };
        default:
            throw new Error(`Unsupported chainId: ${chainId}`);
    }
};
