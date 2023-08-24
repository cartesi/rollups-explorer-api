import { DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../abi/InputBox';
import { LogRecord } from '../abi/abi.support';
import { EventConfig, NetworkConfig, eventConfigs } from '../configs';
import { Application } from '../model';
import Handler from './Handler';

export default class InputAdded implements Handler {
    private readonly eventConfig: EventConfig;

    constructor(
        private readonly ctx: DataHandlerContext<Store>,
        private readonly config: NetworkConfig,
        private dappsStorage: Map<String, Application>,
    ) {
        this.eventConfig = eventConfigs;
    }

    private decodeLog(evmLog: LogRecord) {
        return events.InputAdded.decode(evmLog);
    }

    async handle(e: Log) {
        if (
            e.address === this.config.inputBox.address &&
            e.topics[0] === this.eventConfig.inputBox.inputAdded
        ) {
            const timestamp = BigInt(e.block.timestamp);
            const ctx = this.ctx;
            ctx.log.info(`Indexing InputBox InputAdded event`);
            const input = this.decodeLog(e);
            const dappId = input.dapp.toLowerCase();

            let dapp =
                this.dappsStorage.get(dappId) ??
                (await ctx.store.get(Application, dappId));
            if (dapp) {
                ctx.log.info(`Dapp:${dappId} found`);
                dapp.inputCount += 1;
                dapp.activityTimestamp = timestamp;
            } else {
                ctx.log.warn(
                    `Dapp:${dappId} not found... created by input event`,
                );
                dapp = new Application({
                    id: dappId,
                    activityTimestamp: timestamp,
                    deploymentTimestamp: timestamp,
                    inputCount: 1,
                });
            }

            this.dappsStorage.set(dappId, dapp);
        }

        return true;
    }
}
