import { createLogger } from '@subsquid/logger';
import {
    Store,
    TypeormDatabase,
    TypeormDatabaseOptions,
} from '@subsquid/typeorm-store';

import EventHandler from './handlers/EventHandler';
import { createProcessor, ProcessorContext } from './processor';
import { loadChainsToIndexFromEnvironment } from './utils';

const logger = createLogger('sqd:startup');

const chainsToIndex = loadChainsToIndexFromEnvironment();
if (chainsToIndex.usingDefault)
    logger.warn(
        `Could not find valid chains defined on CHAIN_IDS env var, defaulting to ${chainsToIndex.chains[0]}`,
    );

let message = '';
if (chainsToIndex.chains.length > 1) {
    message += `Starting processors for chains ${chainsToIndex.chains.join(
        ',',
    )}`;
} else {
    message = `Starting processor for chain ${chainsToIndex.chains[0]}`;
}
logger.info(message);

/**
 * changing the default isolationLevel to `READ COMMITED`
 * We don't have cross-chain dependencies but it is a high volume of tx
 * and we do reads while executing writes causing interdependencies and problems.
 * For our case we only want to read what is in the database even as an snapshot and
 * that is not a perceived problem for our case here. see {@link https://docs.sqd.dev/sdk/resources/basics/multichain/#handling-concurrency}
 * and also {@link https://www.postgresql.org/docs/current/transaction-iso.html#XACT-READ-COMMITTED}
 */
const dbOptions: TypeormDatabaseOptions = {
    isolationLevel: 'READ COMMITTED',
    supportHotBlocks: true,
};

// instantiate processor for chain
chainsToIndex.chains.forEach((chainId: number) => {
    const processor = createProcessor(chainId);
    processor.run(
        new TypeormDatabase({
            ...dbOptions,
            stateSchema: `processor-${chainId}`,
        }),
        async (ctx: ProcessorContext<Store>) => {
            const eventHandler = new EventHandler();

            for (const block of ctx.blocks) {
                for (const log of block.logs) {
                    await eventHandler.handle(log, block, ctx);
                }
            }

            const {
                tokens,
                applications,
                factories,
                deposits,
                inputs,
                nfts,
                erc721Deposits,
                multiTokens,
                erc1155Deposits,
                chains,
            } = eventHandler.getValues();

            const total = eventHandler.getTotalHandled();

            if (total > 0) {
                ctx.log.info(
                    `Flushing ${total} entities: ${eventHandler.getSummary()}`,
                );
            }

            await ctx.store.upsert([...chains.values()]);
            await ctx.store.upsert([...multiTokens.values()]);
            await ctx.store.upsert([...tokens.values()]);
            await ctx.store.upsert([...nfts.values()]);
            await ctx.store.upsert([...factories.values()]);
            await ctx.store.upsert([...applications.values()]);
            await ctx.store.upsert([...deposits.values()]);
            await ctx.store.upsert([...erc721Deposits.values()]);
            await ctx.store.upsert([...erc1155Deposits.values()]);
            await ctx.store.upsert([...inputs.values()]);

            // Help GC kick-in and release memory.
            eventHandler.cleanValues();
        },
    );
});
