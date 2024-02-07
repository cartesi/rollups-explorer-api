import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as AuthorityFactoryEvents } from '../abi/AuthorityFactory';
import { AuthorityFactoryAddress } from '../config';
import { Authority } from '../model';
import Handler from './Handler';

export default class AuthorityCreated implements Handler {
    constructor(private authorityStorage: Map<string, Authority>) {}

    async handle(log: Log, _block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === AuthorityFactoryAddress &&
            log.topics[0] === AuthorityFactoryEvents.AuthorityCreated.topic
        ) {
            const { authority } =
                AuthorityFactoryEvents.AuthorityCreated.decode(log);

            ctx.log.info(`${authority} (Authority) stored`);
            const id = authority.toLowerCase();
            this.authorityStorage.set(id, new Authority({ id }));
        }

        return true;
    }
}
