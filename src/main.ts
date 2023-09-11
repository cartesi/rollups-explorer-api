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
    const eventHandler = new EventHandler(ctx);

    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            await eventHandler.handle(log, block.header);
        }
    }

    const { tokens, dapps, factories, deposits, inputs } =
        eventHandler.getValues();

    if (inputs.size || dapps.size || factories.size) {
        ctx.log.warn(
            `########GOING TO SAVE#######\n ( ${inputs.size} ) inputs, ( ${dapps.size} ) dapps, ( ${factories.size} ) factories`,
        );
    }

    await ctx.store.upsert([...tokens.values()]);
    await ctx.store.upsert([...factories.values()]);
    await ctx.store.upsert([...dapps.values()]);
    await ctx.store.upsert([...deposits.values()]);
    await ctx.store.upsert([...inputs.values()]);
});
