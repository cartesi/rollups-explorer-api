import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import {
    Application,
    ApplicationFactory,
    Authority,
    Erc20Deposit,
    Erc721Deposit,
    Input,
    NFT,
    Token,
    ValidatorNode,
    ValidatorNodeProvider,
} from '../model';
import ApplicationCreated from './ApplicationCreated';
import AuthorityCreated from './AuthorityCreated';
import Handler from './Handler';
import InputAdded from './InputAdded';
import OwnershipTransferred from './OwnershipTransferred';
import ValidatorNodeFinancialRunway from './ValidatorNodeFinancialRunway';
import ValidatorNodeMachineLocation from './ValidatorNodeMachineLocation';
import ValidatorNodeProviderCreated from './ValidatorNodeProviderCreated';
import ValidatorNodeProviderPaused from './ValidatorNodeProviderPaused';
import validatorNodeProviderUnpaused from './ValidatorNodeProviderUnpaused';

export default class EventHandler {
    private readonly tokens: Map<string, Token>;
    private readonly deposits: Map<string, Erc20Deposit>;
    private readonly inputs: Map<string, Input>;
    private readonly applications: Map<string, Application>;
    private readonly factories: Map<string, ApplicationFactory>;
    private readonly nfts: Map<string, NFT>;
    private readonly erc721Deposits: Map<string, Erc721Deposit>;
    private readonly authorities: Map<string, Authority>;
    private readonly validatorNodeProviders: Map<string, ValidatorNodeProvider>;
    private readonly validatorNodes: Map<string, ValidatorNode>;
    private readonly applicationCreated: Handler;
    private readonly inputAdded: Handler;
    private readonly ownershipTransferred: Handler;
    private readonly authorityCreated: Handler;
    private readonly validatorNodeProviderCreated: Handler;
    private readonly validatorNodeProviderPaused: Handler;
    private readonly validatorNodeProviderUnpaused: Handler;
    private readonly validatorNodeFinancialRunway: Handler;
    private readonly validatorNodeMachineLocation: Handler;

    constructor() {
        this.tokens = new Map();
        this.deposits = new Map();
        this.inputs = new Map();
        this.applications = new Map();
        this.factories = new Map();
        this.nfts = new Map();
        this.erc721Deposits = new Map();
        this.authorities = new Map();
        this.validatorNodeProviders = new Map();
        this.validatorNodes = new Map();

        this.applicationCreated = new ApplicationCreated(
            this.factories,
            this.applications,
        );
        this.inputAdded = new InputAdded(
            this.tokens,
            this.deposits,
            this.applications,
            this.inputs,
            this.nfts,
            this.erc721Deposits,
        );

        this.ownershipTransferred = new OwnershipTransferred(this.applications);

        this.authorityCreated = new AuthorityCreated(this.authorities);
        this.validatorNodeProviderCreated = new ValidatorNodeProviderCreated(
            this.authorities,
            this.validatorNodeProviders,
            this.tokens,
        );

        this.validatorNodeProviderPaused = new ValidatorNodeProviderPaused(
            this.validatorNodeProviders,
        );
        this.validatorNodeProviderUnpaused = new validatorNodeProviderUnpaused(
            this.validatorNodeProviders,
        );
        this.validatorNodeFinancialRunway = new ValidatorNodeFinancialRunway(
            this.applications,
            this.validatorNodes,
            this.validatorNodeProviders,
        );
        this.validatorNodeMachineLocation = new ValidatorNodeMachineLocation(
            this.applications,
            this.validatorNodes,
            this.validatorNodeProviders,
        );
    }

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        await this.applicationCreated.handle(log, block, ctx);
        await this.inputAdded.handle(log, block, ctx);
        await this.ownershipTransferred.handle(log, block, ctx);
        await this.authorityCreated.handle(log, block, ctx);
        await this.validatorNodeProviderCreated.handle(log, block, ctx);
        await this.validatorNodeMachineLocation.handle(log, block, ctx);
        await this.validatorNodeFinancialRunway.handle(log, block, ctx);
        await this.validatorNodeProviderPaused.handle(log, block, ctx);
        await this.validatorNodeProviderUnpaused.handle(log, block, ctx);
        return true;
    }

    getValues() {
        return {
            tokens: this.tokens,
            applications: this.applications,
            factories: this.factories,
            deposits: this.deposits,
            inputs: this.inputs,
            nfts: this.nfts,
            erc721Deposits: this.erc721Deposits,
            authorities: this.authorities,
            validatorNodeProviders: this.validatorNodeProviders,
            validatorNodes: this.validatorNodes,
        };
    }

    getTotalHandled() {
        return Object.values(this.getValues()).reduce(
            (acc, entityMap) => acc + entityMap.size,
            0,
        );
    }

    getSummary() {
        return Object.entries(this.getValues())
            .map(
                ([entityName, entityMap]) => `${entityName}: ${entityMap.size}`,
            )
            .join(', ');
    }
}
