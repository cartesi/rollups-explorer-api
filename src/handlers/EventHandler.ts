import { DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { NetworkConfig } from '../configs';
import { DApp, DAppFactory } from '../model';
import ApplicationCreated from './ApplicationCreated';
import Handler from './Handler';
import InputAdded from './InputAdded';

export default class EventHandler {
    private readonly dapps: Map<string, DApp>;
    private readonly factories: Map<string, DAppFactory>;
    private readonly applicationCreated: Handler;
    private readonly inputAdded: Handler;

    constructor(ctx: DataHandlerContext<Store>, config: NetworkConfig) {
        this.dapps = new Map();
        this.factories = new Map();
        this.applicationCreated = new ApplicationCreated(
            ctx,
            config,
            this.factories,
            this.dapps,
        );

        this.inputAdded = new InputAdded(ctx, config, this.dapps);
    }

    async handle(e: Log) {
        await this.applicationCreated.handle(e);
        await this.inputAdded.handle(e);

        return true;
    }

    getValues() {
        return {
            dapps: this.dapps,
            factories: this.factories,
        };
    }
}
