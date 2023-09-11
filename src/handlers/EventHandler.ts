import { BlockHeader, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import {
    Application,
    ApplicationFactory,
    Erc20Deposit,
    Input,
    Token,
} from '../model';
import ApplicationCreated from './ApplicationCreated';
import Handler from './Handler';
import InputAdded from './InputAdded';

export default class EventHandler {
    private readonly tokens: Map<string, Token>;
    private readonly deposits: Map<string, Erc20Deposit>;
    private readonly inputs: Map<string, Input>;
    private readonly dapps: Map<string, Application>;
    private readonly factories: Map<string, ApplicationFactory>;
    private readonly applicationCreated: Handler;
    private readonly inputAdded: Handler;

    constructor(ctx: DataHandlerContext<Store>) {
        this.tokens = new Map();
        this.deposits = new Map();
        this.inputs = new Map();
        this.dapps = new Map();
        this.factories = new Map();
        this.applicationCreated = new ApplicationCreated(
            ctx,
            this.factories,
            this.dapps,
        );

        this.inputAdded = new InputAdded(
            ctx,
            this.tokens,
            this.deposits,
            this.dapps,
            this.inputs,
        );
    }

    async handle(log: Log, header: BlockHeader) {
        await this.applicationCreated.handle(log, header);
        await this.inputAdded.handle(log, header);

        return true;
    }

    getValues() {
        return {
            tokens: this.tokens,
            dapps: this.dapps,
            factories: this.factories,
            deposits: this.deposits,
            inputs: this.inputs,
        };
    }
}
