import { createLogger } from '@subsquid/logger';
import { TypeormDatabase } from '@subsquid/typeorm-store';

import EventHandler from './handlers/EventHandler';
import { createProcessor } from './processor';

const logger = createLogger('sqd:startup');

const defaultChainId = '31337';
if (!process.env.CHAIN_ID) {
    logger.warn(
        `Undefined environment variable CHAIN_ID, defaulting to ${defaultChainId}`,
    );
}
const chainId = parseInt(process.env.CHAIN_ID ?? defaultChainId);
logger.info(`Starting processor for chain ${chainId}...`);

// instantiate processor for chain
const processor = createProcessor(chainId);

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
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
        authorities,
        validatorNodeProviders,
        validatorNodes,
    } = eventHandler.getValues();

    const total = eventHandler.getTotalHandled();

    if (total > 0) {
        ctx.log.info(
            `Flushing ${total} entities: ${eventHandler.getSummary()}`,
        );
    }

    await ctx.store.upsert([...authorities.values()]);
    await ctx.store.upsert([...tokens.values()]);
    await ctx.store.upsert([...nfts.values()]);
    await ctx.store.upsert([...factories.values()]);
    await ctx.store.upsert([...applications.values()]);
    await ctx.store.upsert([...deposits.values()]);
    await ctx.store.upsert([...erc721Deposits.values()]);
    await ctx.store.upsert([...inputs.values()]);
    await ctx.store.upsert([...validatorNodeProviders.values()]);
    await ctx.store.upsert([...validatorNodes.values()]);
});
