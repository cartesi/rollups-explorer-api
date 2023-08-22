import { TypeormDatabase } from '@subsquid/typeorm-store';
import EventHandler from './handlers/EventHandler';
import { config, processor } from './processor';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const eventHandler = new EventHandler(ctx, config);

    for (const c of ctx.blocks) {
        for (const e of c.logs) {
            await eventHandler.handle(e);
        }
    }

    const { dapps, factories } = eventHandler.getValues();

    if (dapps.size || factories.size) {
        ctx.log.warn(
            `########GOING TO SAVE#######\n ( ${dapps.size} ) dapps and ( ${factories.size} ) factories`,
        );
    }

    await ctx.store.upsert([...factories.values()]);
    await ctx.store.upsert([...dapps.values()]);
});
