import { DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/CartesiDAppFactory';
import { LogRecord } from '../abi/abi.support';
import { CartesiDAppFactoryAddress, Event } from '../config';
import { Application, ApplicationFactory } from '../model';
import Handler from './Handler';

export default class ApplicationCreated implements Handler {
    constructor(
        private readonly ctx: DataHandlerContext<Store>,
        private factoryStorage: Map<string, ApplicationFactory>,
        private dappsStorage: Map<String, Application>,
    ) {}

    private decodeFactory(evmLog: LogRecord) {
        return events.ApplicationCreated.decode(evmLog);
    }

    async handle(e: Log) {
        if (
            e.address === CartesiDAppFactoryAddress &&
            e.topics[0] === Event.CartesiDAppFactory.ApplicationCreated
        ) {
            const ctx = this.ctx;
            const timestamp = BigInt(e.block.timestamp);

            ctx.log.info(`Indexing factory ApplicationCreated event`);
            ctx.log.info(
                `e.address: ${e.address} - factory address: ${CartesiDAppFactoryAddress}`,
            );
            const { application, dappOwner } = this.decodeFactory(e);

            const dappFactory = new ApplicationFactory({ id: e.address });

            this.factoryStorage.set(e.address, dappFactory);

            const dappId = application.toLowerCase();

            let dapp =
                this.dappsStorage.get(dappId) ??
                (await ctx.store.get(Application, dappId));

            if (dapp) {
                if (!dapp.factory && !dapp.owner) {
                    ctx.log.warn(
                        `Application:${dappId} created by event found. updating owner and factory`,
                    );
                    dapp.factory = dappFactory;
                    dapp.owner = dappOwner.toLowerCase();
                }
            } else {
                ctx.log.info(
                    `Application:${dappId} will be created and added to the Map`,
                );
                dapp = new Application({
                    id: dappId,
                    activityTimestamp: timestamp,
                    deploymentTimestamp: timestamp,
                    factory: dappFactory,
                    inputCount: 0,
                    owner: dappOwner.toLowerCase(),
                });
            }

            this.dappsStorage.set(dappId, dapp);
        }

        return true;
    }
}
