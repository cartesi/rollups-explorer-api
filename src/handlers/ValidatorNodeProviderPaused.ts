import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as ValidatorNodeProviderEvents } from '../abi/ValidatorNodeProvider';
import { NodeProvider } from '../model';
import Handler from './Handler';

export default class ValidatorNodeProviderPaused implements Handler {
    constructor(private providers: Map<string, NodeProvider>) {}

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (log.topics[0] === ValidatorNodeProviderEvents.Paused.topic) {
            const address = log.address.toLowerCase();
            const provider =
                this.providers.get(address) ??
                (await ctx.store.get(NodeProvider, address));

            if (provider) {
                provider.paused = true;
                this.providers.set(address, provider);
            }
        }
        return true;
    }
}
