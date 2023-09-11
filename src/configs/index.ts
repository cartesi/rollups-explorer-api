import { lookupArchive } from '@subsquid/archive-registry';

import arb_goerli_fact_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/CartesiDAppFactory.json';
import arb_goerli_erc20Portal_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/ERC20Portal.json';
import arb_goerli_inputbox_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json';
import mainnet_fact_deployment from '@cartesi/rollups/deployments/mainnet/CartesiDAppFactory.json';
import mainnet_erc20Portal_deployment from '@cartesi/rollups/deployments/mainnet/ERC20Portal.json';
import mainnet_inputbox_deployment from '@cartesi/rollups/deployments/mainnet/InputBox.json';
import sepolia_fact_deployment from '@cartesi/rollups/deployments/sepolia/CartesiDAppFactory.json';
import sepolia_erc20Portal_deployment from '@cartesi/rollups/deployments/sepolia/ERC20Portal.json';
import sepolia_inputbox_deployment from '@cartesi/rollups/deployments/sepolia/InputBox.json';
import { events as FactoryEvents } from '../abi/CartesiDAppFactory';
import { events as InputBoxEvents } from '../abi/InputBox';

export const SupportedNetworks = {
    ARBITRUM_GOERLI: '421613',
    LOCALHOST: '31337',
    MAINNET: '1',
    SEPOLIA: '11155111',
} as const;

export const eventConfigs = {
    cartesiDAppFactory: {
        applicationCreated: FactoryEvents.ApplicationCreated.topic,
    },
    inputBox: {
        inputAdded: InputBoxEvents.InputAdded.topic,
    },
} as const;

export const networkConfigs = {
    [SupportedNetworks.ARBITRUM_GOERLI]: {
        archive: lookupArchive('arbitrum-goerli'),
        chain: process.env.RPC_ENDPOINT,
        cartesiDAppFactory: {
            deployment: arb_goerli_fact_deployment,
            address: arb_goerli_fact_deployment.address.toLowerCase(),
            abi: arb_goerli_fact_deployment.abi,
            block: arb_goerli_fact_deployment.receipt.blockNumber,
        },
        erc20Portal: {
            deployment: arb_goerli_erc20Portal_deployment,
            address:
                arb_goerli_erc20Portal_deployment.address.toLocaleLowerCase(),
            abi: arb_goerli_erc20Portal_deployment.abi,
            block: arb_goerli_erc20Portal_deployment.receipt.blockNumber,
        },
        inputBox: {
            deployment: arb_goerli_inputbox_deployment,
            address: arb_goerli_inputbox_deployment.address.toLowerCase(),
            abi: arb_goerli_inputbox_deployment.abi,
            block: arb_goerli_inputbox_deployment.receipt.blockNumber,
        },
    },
    [SupportedNetworks.LOCALHOST]: {
        archive: undefined,
        chain: process.env.RPC_ENDPOINT ?? 'http://127.0.0.1:8545',
        cartesiDAppFactory: {
            deployment: mainnet_fact_deployment,
            address: mainnet_fact_deployment.address.toLowerCase(),
            abi: mainnet_fact_deployment.abi,
            block: 0,
        },
        erc20Portal: {
            deployment: mainnet_erc20Portal_deployment,
            address: mainnet_erc20Portal_deployment.address.toLocaleLowerCase(),
            abi: mainnet_erc20Portal_deployment.abi,
            block: 0,
        },
        inputBox: {
            deployment: mainnet_inputbox_deployment,
            address: mainnet_inputbox_deployment.address.toLowerCase(),
            abi: mainnet_inputbox_deployment.abi,
            block: 0,
        },
    },
    [SupportedNetworks.MAINNET]: {
        archive: lookupArchive('eth-mainnet'),
        chain: process.env.RPC_ENDPOINT ?? 'https://rpc.ankr.com/eth',
        cartesiDAppFactory: {
            deployment: mainnet_fact_deployment,
            address: mainnet_fact_deployment.address.toLowerCase(),
            abi: mainnet_fact_deployment.abi,
            block: mainnet_fact_deployment.receipt.blockNumber,
        },
        erc20Portal: {
            deployment: mainnet_erc20Portal_deployment,
            address: mainnet_erc20Portal_deployment.address.toLocaleLowerCase(),
            abi: mainnet_erc20Portal_deployment.abi,
            block: mainnet_erc20Portal_deployment.receipt.blockNumber,
        },
        inputBox: {
            deployment: mainnet_inputbox_deployment,
            address: mainnet_inputbox_deployment.address.toLowerCase(),
            abi: mainnet_inputbox_deployment.abi,
            block: mainnet_inputbox_deployment.receipt.blockNumber,
        },
    },
    [SupportedNetworks.SEPOLIA]: {
        archive: lookupArchive('sepolia'),
        chain: process.env.RPC_ENDPOINT ?? 'https://rpc.ankr.com/eth_sepolia',
        cartesiDAppFactory: {
            deployment: sepolia_fact_deployment,
            address: sepolia_fact_deployment.address.toLowerCase(),
            abi: sepolia_fact_deployment.abi,
            block: sepolia_fact_deployment.receipt.blockNumber,
        },
        erc20Portal: {
            deployment: sepolia_erc20Portal_deployment,
            address: sepolia_erc20Portal_deployment.address.toLocaleLowerCase(),
            abi: sepolia_erc20Portal_deployment.abi,
            block: sepolia_erc20Portal_deployment.receipt.blockNumber,
        },
        inputBox: {
            deployment: sepolia_inputbox_deployment,
            address: sepolia_inputbox_deployment.address.toLowerCase(),
            abi: sepolia_inputbox_deployment.abi,
            block: sepolia_inputbox_deployment.receipt.blockNumber,
        },
    },
} as const;

export type ProcessorConfig = {
    rateLimit?: number;
    maxBatchCallSize?: number;
};

export type SupportedChainId =
    (typeof SupportedNetworks)[keyof typeof SupportedNetworks];

export type NetworkConfig =
    (typeof networkConfigs)[keyof typeof networkConfigs];
export type EventConfig = typeof eventConfigs;

export const processorConfigs = new Map<SupportedChainId, ProcessorConfig>([
    [
        SupportedNetworks.ARBITRUM_GOERLI,
        { rateLimit: 15, maxBatchCallSize: 100 },
    ],
]);
