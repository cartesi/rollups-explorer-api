import { DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDAppFactory';
import { CartesiDAppFactoryAddress } from '../config';
import { Application, ApplicationFactory } from '../model';
import Handler from './Handler';

export default class ApplicationCreated implements Handler {
    constructor(
        private readonly ctx: DataHandlerContext<Store>,
        private factoryStorage: Map<string, ApplicationFactory>,
        private applicationStorage: Map<String, Application>,
    ) {}

    async handle(log: Log) {
        if (
            log.address === CartesiDAppFactoryAddress &&
            log.topics[0] === events.ApplicationCreated.topic
        ) {
            const ctx = this.ctx;
            const timestamp = BigInt(log.block.timestamp);

            // decode event
            const { application, dappOwner } =
                events.ApplicationCreated.decode(log);

            // "create" factory
            ctx.log.info(`Factory ${log.address} created`);
            const factory = new ApplicationFactory({ id: log.address });
            this.factoryStorage.set(log.address, factory);

            // create application
            const id = application.toLowerCase();

            ctx.log.info(`Application ${id} created`);
            const app = new Application({
                id,
                activityTimestamp: timestamp,
                deploymentTimestamp: timestamp,
                factory,
                inputCount: 0,
                owner: dappOwner.toLowerCase(),
            });
            this.applicationStorage.set(id, app);
        }

        return true;
    }
}
