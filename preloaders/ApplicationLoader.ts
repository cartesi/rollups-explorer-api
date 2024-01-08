import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { Database, LocalDest } from '@subsquid/file-store';
import { createLogger } from '@subsquid/logger';
import {
    events as CartesiDAppFactory,
    events,
} from '../src/abi/CartesiDAppFactory';
import { CartesiDAppFactoryAddress, getConfig } from '../src/config';

type Metadata = {
    height: number;
    hash: string;
    addresses: Record<string, string[]>;
};

const logger = createLogger('sqd:preloader:application');

if (!process.env.CHAIN_ID) {
    logger.error(
        'Looks like the CHAIN_ID environment is not set. The supported chain ids are [1, 11155111]',
    );
    throw new Error('ChainId is required to preload the application addresses');
}

const chainId = parseInt(process.env.CHAIN_ID ?? 0);
const config = getConfig(chainId);

logger.info(`Processing chain_id: ${chainId}`);

const processor = new EvmBatchProcessor()
    .setDataSource(config.dataSource)
    .useArchiveOnly(true)
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
        address: [CartesiDAppFactoryAddress],
        topic0: [CartesiDAppFactory.ApplicationCreated.topic],
    });

const appFilename = `applications-${chainId}.json` as const;

let applications: string[] = [];
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
                    applications = addresses[CartesiDAppFactoryAddress];
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
                    [CartesiDAppFactoryAddress]: applications,
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
                log.address === CartesiDAppFactoryAddress &&
                log.topics[0] === events.ApplicationCreated.topic
            ) {
                const { application } = events.ApplicationCreated.decode(log);
                const id = application.toLowerCase();

                applications.push(id);
                ctx.log.info(`${id} (Application) preloaded`);
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
