import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
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
    private readonly applications: Map<string, Application>;
    private readonly factories: Map<string, ApplicationFactory>;
    private readonly applicationCreated: Handler;
    private readonly inputAdded: Handler;

    constructor() {
        this.tokens = new Map();
        this.deposits = new Map();
        this.inputs = new Map();
        this.applications = new Map();
        this.factories = new Map();
        this.applicationCreated = new ApplicationCreated(
            this.factories,
            this.applications,
        );

        this.inputAdded = new InputAdded(
            this.tokens,
            this.deposits,
            this.applications,
            this.inputs,
        );
    }

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        await this.applicationCreated.handle(log, block, ctx);
        await this.inputAdded.handle(log, block, ctx);
        return true;
    }

    getValues() {
        return {
            tokens: this.tokens,
            applications: this.applications,
            factories: this.factories,
            deposits: this.deposits,
            inputs: this.inputs,
        };
    }
}
