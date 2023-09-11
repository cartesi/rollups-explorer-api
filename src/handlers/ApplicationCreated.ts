import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDAppFactory';
import { CartesiDAppFactoryAddress } from '../config';
import { Application, ApplicationFactory } from '../model';
import Handler from './Handler';

export default class ApplicationCreated implements Handler {
    constructor(
        private factoryStorage: Map<string, ApplicationFactory>,
        private applicationStorage: Map<String, Application>,
    ) {}

    async handle(log: Log, _block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === CartesiDAppFactoryAddress &&
            log.topics[0] === events.ApplicationCreated.topic
        ) {
            const timestamp = BigInt(log.block.timestamp);

            // decode event
            const { application, dappOwner } =
                events.ApplicationCreated.decode(log);

            // "create" factory
            const factory = new ApplicationFactory({ id: log.address });
            this.factoryStorage.set(log.address, factory);
            ctx.log.info(`${log.address} (Factory) stored`);

            // create application
            const id = application.toLowerCase();

            const app = new Application({
                id,
                activityTimestamp: timestamp,
                deploymentTimestamp: timestamp,
                factory,
                inputCount: 0,
                owner: dappOwner.toLowerCase(),
            });
            this.applicationStorage.set(id, app);
            ctx.log.info(`${id} (Application) stored`);
        }

        return true;
    }
}
