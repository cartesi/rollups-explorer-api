import CartesiDAppFactoryArbitrum from '@cartesi/rollups/deployments/arbitrum/CartesiDAppFactory.json';
import InputBoxArbitrum from '@cartesi/rollups/deployments/arbitrum/InputBox.json';
import CartesiDAppFactoryArbitrumGoerli from '@cartesi/rollups/deployments/arbitrum_goerli/CartesiDAppFactory.json';
import InputBoxArbitrumGoerli from '@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json';
import CartesiDAppFactoryMainnet from '@cartesi/rollups/deployments/mainnet/CartesiDAppFactory.json';
import InputBoxMainnet from '@cartesi/rollups/deployments/mainnet/InputBox.json';
import CartesiDAppFactorySepolia from '@cartesi/rollups/deployments/sepolia/CartesiDAppFactory.json';
import InputBoxSepolia from '@cartesi/rollups/deployments/sepolia/InputBox.json';
import rollupsMainnet from '@cartesi/rollups/export/abi/mainnet.json';
import { lookupArchive } from '@subsquid/archive-registry';
import { GatewaySettings, RpcEndpointSettings } from '@subsquid/evm-processor';
import { arbitrum, arbitrumGoerli, mainnet, sepolia } from 'viem/chains';

// addresses are the same on all chains
export const CartesiDAppFactoryAddress =
    rollupsMainnet.contracts.CartesiDAppFactory.address.toLowerCase();
export const ERC20PortalAddress =
    rollupsMainnet.contracts.ERC20Portal.address.toLowerCase();
export const InputBoxAddress =
    rollupsMainnet.contracts.InputBox.address.toLowerCase();
export const ERC721PortalAddress =
    rollupsMainnet.contracts.ERC721Portal.address.toLowerCase();
export const AuthorityFactoryAddress =
    '0x519421Bd7843e0D1E2F280490962850e31c86087'.toLowerCase();
export const MarketplaceAddress =
    '0xB6dd5307629186A5d16611AAC1A14CdE9EA49f57'.toLowerCase();

export type ProcessorConfig = {
    settings: {
        gateway?: GatewaySettings;
        rpcEndpoint: RpcEndpointSettings;
    };
    from: number;
    finalityConfirmation?: number;
};

export const getConfig = (chainId: number): ProcessorConfig => {
    const RPC_URL = `RPC_URL_${chainId}`;
    switch (chainId) {
        case 1: // mainnet
            return {
                settings: {
                    gateway: {
                        url: lookupArchive('eth-mainnet'),
                    },
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            mainnet.rpcUrls.default.http[0],
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryMainnet.receipt.blockNumber,
                    InputBoxMainnet.receipt.blockNumber,
                ),
            };
        case 11155111: // sepolia
            return {
                settings: {
                    gateway: {
                        url: lookupArchive('sepolia'),
                    },
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            sepolia.rpcUrls.default.http[0],
                    },
                },
                from: Math.min(
                    CartesiDAppFactorySepolia.receipt.blockNumber,
                    InputBoxSepolia.receipt.blockNumber,
                ),
            };
        case 31337: // anvil
            return {
                settings: {
                    rpcEndpoint: {
                        url: process.env[RPC_URL] ?? 'http://127.0.0.1:8545',
                    },
                },
                from: 0,
            };
        case 42161: // Arbitrum
            return {
                settings: {
                    gateway: {
                        url: lookupArchive('arbitrum'),
                    },
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            arbitrum.rpcUrls.default.http[0],
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryArbitrum.receipt.blockNumber,
                    InputBoxArbitrum.receipt.blockNumber,
                ),
            };
        case 421613: // Arbitrum-goerli
            return {
                settings: {
                    gateway: {
                        url: lookupArchive('arbitrum-goerli'),
                    },
                    rpcEndpoint: {
                        url:
                            process.env[RPC_URL] ??
                            arbitrumGoerli.rpcUrls.default.http[0],
                    },
                },
                from: Math.min(
                    CartesiDAppFactoryArbitrumGoerli.receipt.blockNumber,
                    InputBoxArbitrumGoerli.receipt.blockNumber,
                ),
            };
        default:
            throw new Error(`Unsupported chainId: ${chainId}`);
    }
};
