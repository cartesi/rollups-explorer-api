import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { Database, LocalDest } from '@subsquid/file-store';
import { createLogger } from '@subsquid/logger';
import { events as MarketplaceEvents } from '../src/abi/Marketplace';
import { MarketplaceAddress, getConfig } from '../src/config';

type Metadata = {
    height: number;
    hash: string;
    addresses: Record<string, string[]>;
};

const logger = createLogger('sqd:preloader:validator-node-provider');

if (!process.env.CHAIN_ID) {
    logger.error(
        'Looks like the CHAIN_ID environment is not set. The supported chain ids are [1, 11155111, 42161, 421613]',
    );
    throw new Error(
        'ChainId is required to preload the validator-node-provider addresses',
    );
}

const chainId = parseInt(process.env.CHAIN_ID ?? 0);
const config = getConfig(chainId);

logger.info(`Processing chain_id: ${chainId}`);

const processor = new EvmBatchProcessor()
    .setGateway(config.settings.gateway!)
    .setRpcDataIngestionSettings({ disabled: true }) // it sets to use only the archive node for data ingestion.
    .setFinalityConfirmation(config.finalityConfirmation ?? 10)
    .setFields({
        log: {
            topics: true,
        },
    })
    .setBlockRange({
        from: config.from,
    })
    .addLog({
        address: [MarketplaceAddress],
        topic0: [MarketplaceEvents.ValidatorNodeProviderCreated.topic],
    });

const appFilename = `validator-node-provider-${chainId}.json` as const;

let providers: string[] = [];
let isInit = false;

const database = new Database({
    tables: {},
    dest: new LocalDest('./assets'),
    chunkSizeMb: Infinity,
    hooks: {
        async onStateRead(dest) {
            if (await dest.exists(appFilename)) {
                let { height, hash, addresses }: Metadata = await dest
                    .readFile(appFilename)
                    .then(JSON.parse);

                if (!isInit) {
                    providers = addresses[MarketplaceAddress];
                    isInit = true;
                }

                return { height, hash };
            } else {
                return undefined;
            }
        },
        async onStateUpdate(dest, info) {
            let metadata: Metadata = {
                ...info,
                addresses: {
                    [MarketplaceAddress]: providers,
                },
            };

            await dest.writeFile(appFilename, JSON.stringify(metadata));
        },
    },
});

processor.run(database, async (ctx) => {
    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (
                log.address === MarketplaceAddress &&
                log.topics[0] ===
                    MarketplaceEvents.ValidatorNodeProviderCreated.topic
            ) {
                const { provider } =
                    MarketplaceEvents.ValidatorNodeProviderCreated.decode(log);
                const id = provider.toLowerCase();

                providers.push(id);
                ctx.log.info(`${id} (ValidatorNodeProvider) preloaded`);
            }
        }
    }

    ctx.store.setForceFlush(true);

    if (ctx.isHead) {
        ctx.log.info(
            `Block header for chain-id ${chainId} reached. Finishing preloader`,
        );
        process.exit();
    }
});
