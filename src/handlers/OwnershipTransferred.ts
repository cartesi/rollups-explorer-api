import { DataHandlerContext } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDApp';
import { Application, Chain } from '../model';
import { BlockData, Log } from '../processor';
import { generateIDFrom } from '../utils';
import Handler from './Handler';

export default class OwnershipTransferred implements Handler {
    constructor(
        private applicationStorage: Map<string, Application>,
        private chainStorage: Map<string, Chain>,
    ) {}

    async handle(log: Log, _block: BlockData, ctx: DataHandlerContext<Store>) {
        if (log.topics[0] === events.OwnershipTransferred.topic) {
            const chainId = log.transaction?.chainId?.toString();
            const toAddress = log.transaction?.to?.toLowerCase();

            const chain = new Chain({ id: chainId });
            const appId = generateIDFrom([chain.id, toAddress]);

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
                this.chainStorage.set(chain.id, chain);
            }
        }

        return true;
    }
}
