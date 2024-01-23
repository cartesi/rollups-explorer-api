import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as ValidatorNodeProviderEvents } from '../abi/ValidatorNodeProvider';
import { Application, ValidatorNode, ValidatorNodeProvider } from '../model';
import Handler from './Handler';

export default class ValidatorNodeMachineLocation implements Handler {
    constructor(
        private apps: Map<string, Application>,
        private nodes: Map<string, ValidatorNode>,
        private providers: Map<string, ValidatorNodeProvider>,
    ) {}

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.topics[0] === ValidatorNodeProviderEvents.MachineLocation.topic
        ) {
            const providerAddress = log.address.toLowerCase();
            const provider =
                this.providers.get(providerAddress) ??
                (await ctx.store.get(ValidatorNodeProvider, providerAddress));

            if (provider) {
                const { dapp, location } =
                    ValidatorNodeProviderEvents.MachineLocation.decode(log);
                const appId = dapp.toLowerCase();
                const nodeId = `${providerAddress}-${appId}`;
                let node =
                    this.nodes.get(nodeId) ??
                    (await ctx.store.get(ValidatorNode, nodeId));

                if (!node) {
                    const application =
                        this.apps.get(appId) ??
                        (await ctx.store.get(Application, appId));
                    node = new ValidatorNode({
                        id: nodeId,
                        provider,
                        application,
                    });
                }
                node.location = location;

                this.nodes.set(nodeId, node);
            }
        }

        return true;
    }
}
