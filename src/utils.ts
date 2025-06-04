import { existsSync, readFileSync } from 'node:fs';
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

export const supportedChains = new Set<number>([
    mainnet.id,
    sepolia.id,
    foundry.id,
    cannon.id,
    base.id,
    baseSepolia.id,
    optimism.id,
    optimismSepolia.id,
    arbitrum.id,
    arbitrumSepolia.id,
]);

/**
 * Read the environment variable CHAIN_IDS and filter by
 * supported chains, if none the chain 31337 is returned as default.
 * @example
 *  // Return when multiple supported chains are defined.
 *  {chains: [1, 10, 11155111], usingDefault: false}
 * @example
 *  // Return when no valid chains are defined.
 * { chains: [31337], usingDefault: true}
 * @returns {number[]}
 */
export function loadChainsToIndexFromEnvironment() {
    const stringList = (process.env.CHAIN_IDS ?? '').split(',');
    const setOfIds = new Set(
        stringList
            .map((value) => parseIntOr({ value, defaultVal: -1 }))
            .filter((id) => supportedChains.has(id)),
    );

    if (setOfIds.size === 0)
        return { chains: [foundry.id], usingDefault: true };

    return {
        chains: Array.from(setOfIds),
        usingDefault: false,
    };
}
interface ParseIntOr {
    value?: string;
    defaultVal: number;
}

export function parseIntOr({ value, defaultVal }: ParseIntOr) {
    const number = parseInt(value ?? '');
    return Number.isNaN(number) ? defaultVal : number;
}

/**
 * @description Receive a list of parseable strings and return the smallest one as a number.
 *
 * If list is null/undefined/empty 0 is returned.
 * @param {string[]} list
 * @returns {number}
 */
export function smallerOf(list: string[]): number {
    if (!list || list.length === 0) return 0;
    const copied = [...list];

    const initialValue = parseIntOr({
        value: copied.shift(),
        defaultVal: Number.MAX_SAFE_INTEGER,
    });

    return copied.reduce((curr, next) => {
        return Math.min(curr, parseIntOr({ value: next, defaultVal: curr }));
    }, initialValue);
}

/**
 * Utility to generate standard format IDs based on array of values.
 * That makes the id creation between entities less error prone.
 * The separator used is "-"
 * @example
 *  applicationId = "5-0xcbceaf7c9085e33629bcb8f5b6a6d230cf9ece61"
 *  inputId = "5-0xcbceaf7c9085e33629bcb8f5b6a6d230cf9ece61-209"
 * @param values List of values for ID generation
 * @returns
 */
export function generateIDFrom(values: unknown[] = []) {
    const separator = '-';
    return values.join(separator);
}
