import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDApp';
import { Application } from '../model';
import Handler from './Handler';

export default class OwnershipTransferred implements Handler {
    constructor(private applicationStorage: Map<String, Application>) {}

    async handle(log: Log, _block: BlockData, ctx: DataHandlerContext<Store>) {
        if (log.topics[0] === events.OwnershipTransferred.topic) {
            const appId = log.transaction?.to?.toLowerCase() ?? '';
            const application =
                this.applicationStorage.get(appId) ??
                (await ctx.store.get(Application, appId));

            if (application) {
                // decode event
                const { newOwner } = events.OwnershipTransferred.decode(log);
                const owner = newOwner.toLowerCase();
                ctx.log.info(`${application.id} (Ownership) transferred`);
                ctx.log.info(`\t${application.owner} (Current) Owner`);
                ctx.log.info(`\t${owner} (New) Owner`);

                application.owner = owner;
                this.applicationStorage.set(application.id, application);
            }
        }

        return true;
    }
}
