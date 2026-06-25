import { GatewaySettings } from '@subsquid/evm-processor';

/**
 * Archive nodes raw gateway URLs more info {@link https://docs.subsquid.io/glossary/#archive-registry}
 *
 * To find a new URL run the following command
 * @example
 *  npm run sqd gateways ls
 */
export const archiveNodes = {
    base: 'https://v2.archive.subsquid.io/network/base-mainnet',
    baseSepolia: 'https://v2.archive.subsquid.io/network/base-sepolia',
    optimism: 'https://v2.archive.subsquid.io/network/optimism-mainnet',
    optimismSepolia: 'https://v2.archive.subsquid.io/network/optimism-sepolia',
    mainnet: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    sepolia: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
    arbitrum: 'https://v2.archive.subsquid.io/network/arbitrum-one',
    arbitrumSepolia: 'https://v2.archive.subsquid.io/network/arbitrum-sepolia',
} as const;

type SupportedGateways = keyof typeof archiveNodes;

/**
 * Get the archive gateway settings for a specific network.
 * @param gateway The network for which to get the archive gateway settings.
 * @returns The gateway settings including the URL and configured API key (required).
 */
export const getArchiveGateway = (
    gateway: SupportedGateways,
): GatewaySettings => {
    const archiveGatewayApiKey = process.env.ARCHIVE_GATEWAY_API_KEY;
    if (!archiveGatewayApiKey) {
        throw new Error(
            'Required ARCHIVE_GATEWAY_API_KEY environment variable is not set.',
        );
    }

    const archiveUrl = archiveNodes[gateway];

    if (!archiveUrl) {
        throw new Error(
            `Unsupported gateway: ${gateway}.\nSupported archive gateways: ${Object.keys(archiveNodes).join(', ')}`,
        );
    }

    return {
        url: archiveUrl,
        apiKey: archiveGatewayApiKey,
    };
};
