import { existsSync, readFileSync } from 'node:fs';

type Metadata = {
    height: number;
    addresses: Record<string, string[]>;
};

function loadMetadata(filePath: string): Metadata | null {
    if (!existsSync(filePath)) return null;

    const file = readFileSync(filePath, 'utf-8');
    return JSON.parse(file) as Metadata;
}

/**
 * Load application metadata structure containing block height and the list of
 * application addresses from specified CartesiDAppFactory address.
 * @param chainId
 * @returns {Metadata | null}
 */
export function loadApplications(chainId: number): Metadata | null {
    const filePath = `./assets/applications-${chainId}.json`;

    return loadMetadata(filePath);
}

/**
 * Load validator-node-provider metadata structure containing block height and the list of
 * provider addresses from specified Marketplace address.
 * @param chainId
 * @returns {Metadata | null}
 */
export function loadProviders(chainId: number): Metadata | null {
    const filePath = `./assets/validator-node-provider-${chainId}.json`;
    return loadMetadata(filePath);
}
