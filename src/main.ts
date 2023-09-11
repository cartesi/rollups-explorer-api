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

    const { tokens, applications, factories, deposits, inputs } =
        eventHandler.getValues();

    const total =
        tokens.size +
        applications.size +
        factories.size +
        deposits.size +
        inputs.size;

    if (total > 0) {
        const summary = Object.entries({
            tokens: tokens.size,
            applications: applications.size,
            factories: factories.size,
            deposits: deposits.size,
            inputs: inputs.size,
        })
            .map(([entity, count]) => `${entity}: ${count}`)
            .join(', ');
        ctx.log.info(`Flushing ${total} entities: ${summary}`);
    }

    await ctx.store.upsert([...tokens.values()]);
    await ctx.store.upsert([...factories.values()]);
    await ctx.store.upsert([...applications.values()]);
    await ctx.store.upsert([...deposits.values()]);
    await ctx.store.upsert([...inputs.values()]);
});
