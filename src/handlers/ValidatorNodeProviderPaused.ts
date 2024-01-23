import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as ValidatorNodeProviderEvents } from '../abi/ValidatorNodeProvider';
import { ValidatorNodeProvider } from '../model';
import Handler from './Handler';

export default class ValidatorNodeProviderPaused implements Handler {
    constructor(private providers: Map<string, ValidatorNodeProvider>) {}

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (log.topics[0] === ValidatorNodeProviderEvents.Paused.topic) {
            const address = log.address.toLowerCase();
            const provider =
                this.providers.get(address) ??
                (await ctx.store.get(ValidatorNodeProvider, address));

            if (provider) {
                provider.paused = true;
                this.providers.set(address, provider);
            }
        }
        return true;
    }
}
