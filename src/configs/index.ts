import arb_goerli_fact_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/CartesiDAppFactory.json';
import arb_goerli_erc20Portal_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/ERC20Portal.json';
import arb_goerli_inputbox_deployment from '@cartesi/rollups/deployments/arbitrum_goerli/InputBox.json';
import sepolia_fact_deployment from '@cartesi/rollups/deployments/sepolia/CartesiDAppFactory.json';
import sepolia_erc20Portal_deployment from '@cartesi/rollups/deployments/sepolia/ERC20Portal.json';
import sepolia_inputbox_deployment from '@cartesi/rollups/deployments/sepolia/InputBox.json';
import { events as FactoryEvents } from '../abi/CartesiDAppFactory';
import { events as InputBoxEvents } from '../abi/InputBox';

export const SupportedNetworks = {
    ARBITRUM_GOERLI: '421613',
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
        archive: 'https://v2.archive.subsquid.io/network/arbitrum-goerli',
        chain: process.env.ARB_GOERLI_RPC_ENDPOINT,
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
    [SupportedNetworks.SEPOLIA]: {
        archive: 'https://v2.archive.subsquid.io/network/ethereum-sepolia',
        chain:
            process.env.SEPOLIA_RPC_ENDPOINT ??
            'https://rpc.ankr.com/eth_sepolia',
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
