import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as ValidatorNodeProviderEvents } from '../abi/ValidatorNodeProvider';
import { Application, FunctionType, Node, NodeProvider } from '../model';
import Handler from './Handler';

export default class ValidatorNodeFinancialRunway implements Handler {
    constructor(
        private apps: Map<string, Application>,
        private nodes: Map<string, Node>,
        private providers: Map<string, NodeProvider>,
    ) {}

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.topics[0] === ValidatorNodeProviderEvents.FinancialRunway.topic
        ) {
            const providerAddress = log.address.toLowerCase();
            const provider =
                this.providers.get(providerAddress) ??
                (await ctx.store.get(NodeProvider, providerAddress));

            if (provider) {
                const { dapp, until } =
                    ValidatorNodeProviderEvents.FinancialRunway.decode(log);
                const appId = dapp.toLowerCase();
                const nodeId = `${providerAddress}-${appId}`;
                let node =
                    this.nodes.get(nodeId) ??
                    (await ctx.store.get(Node, nodeId));

                if (!node) {
                    const application =
                        this.apps.get(appId) ??
                        (await ctx.store.get(Application, appId));
                    node = new Node({
                        type: FunctionType.VALIDATOR,
                        id: nodeId,
                        provider,
                        application,
                    });
                }
                node.runway = until;

                this.nodes.set(nodeId, node);
            }
        }

        return true;
    }
}
