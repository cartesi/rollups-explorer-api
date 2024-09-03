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
