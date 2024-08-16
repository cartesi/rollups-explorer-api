import { DataHandlerContext } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDAppFactory';
import { CartesiDAppFactoryAddress } from '../config';
import { Application, ApplicationFactory, Chain } from '../model';
import { BlockData, Log } from '../processor';
import { generateIDFrom } from '../utils';
import Handler from './Handler';

export default class ApplicationCreated implements Handler {
    constructor(
        private factoryStorage: Map<string, ApplicationFactory>,
        private applicationStorage: Map<string, Application>,
        private chainStorage: Map<string, Chain>,
    ) {}

    async handle(log: Log, _block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === CartesiDAppFactoryAddress &&
            log.topics[0] === events.ApplicationCreated.topic
        ) {
            if (!log.transaction?.chainId)
                throw new Error(
                    'Chain id is required to save ApplicationCreated events and related data!',
                );

            const timestamp = BigInt(log.block.timestamp);

            const chain = new Chain({
                id: log.transaction?.chainId?.toString(),
            });

            this.chainStorage.set(chain.id, chain);
            // decode event
            const { application, dappOwner } =
                events.ApplicationCreated.decode(log);

            // "create" factory
            const factory = new ApplicationFactory({
                id: generateIDFrom([chain.id, log.address.toLowerCase()]),
                address: log.address.toLowerCase(),
                chain: chain,
            });

            this.factoryStorage.set(factory.id, factory);
            ctx.log.info(`${factory.id} (Factory) stored`);

            // create application
            const id = generateIDFrom([chain.id, application.toLowerCase()]);
            const app = new Application({
                id,
                factory,
                owner: dappOwner.toLowerCase(),
                timestamp: timestamp / 1000n,
                address: application.toLowerCase(),
                chain,
            });

            this.applicationStorage.set(id, app);
            ctx.log.info(`${id} (Application) stored`);
        }

        return true;
    }
}
