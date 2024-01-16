import { existsSync, readFileSync } from 'node:fs';

type ApplicationMetadata = {
    height: number;
    addresses: Record<string, string[]>;
};

/**
 * Load application metadata structure containing block height and the list of
 * application addresses from specified CartesiDAppFactory address.
 * @param chainId
 * @returns {ApplicationMetadata | null}
 */
export function loadApplications(chainId: number): ApplicationMetadata | null {
    const filePath = `./assets/applications-${chainId}.json`;

    if (!existsSync(filePath)) return null;

    const file = readFileSync(filePath, 'utf-8');
    return JSON.parse(file) as ApplicationMetadata;
}
