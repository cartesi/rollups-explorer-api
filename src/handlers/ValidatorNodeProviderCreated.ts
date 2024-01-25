import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { events as MarketplaceEvents } from '../abi/Marketplace';
import { MarketplaceAddress } from '../config';
import { Authority, Token, ValidatorNodeProvider } from '../model';
import Handler from './Handler';
import TokenHelper from './helpers/TokenHelper';

export default class ValidatorNodeProviderCreated implements Handler {
    constructor(
        private authorities: Map<string, Authority>,
        private providers: Map<string, ValidatorNodeProvider>,
        private tokens: Map<string, Token>,
    ) {}

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === MarketplaceAddress &&
            log.topics[0] ===
                MarketplaceEvents.ValidatorNodeProviderCreated.topic
        ) {
            let { provider, consensus, token, payee, price } =
                MarketplaceEvents.ValidatorNodeProviderCreated.decode(log);
            const tokenId = token.toLowerCase();
            const providerId = provider.toLowerCase();
            const authorityId = consensus.toLowerCase();
            let authority =
                this.authorities.get(authorityId) ??
                (await ctx.store.get(Authority, authorityId));

            let tokenInstance =
                this.tokens.get(tokenId) ??
                (await ctx.store.get(Token, tokenId));

            if (!authority) {
                authority = new Authority({ id: authorityId });
                this.authorities.set(authorityId, authority);
            }

            if (!tokenInstance) {
                tokenInstance = await TokenHelper.createToken(
                    tokenId,
                    ctx,
                    block,
                );
                this.tokens.set(tokenId, tokenInstance);
            }

            ctx.log.info(`${providerId} (ValidatorNodeProvider) stored`);
            this.providers.set(
                providerId,
                new ValidatorNodeProvider({
                    id: providerId,
                    token: tokenInstance,
                    paused: false,
                    authority,
                    payee: payee.toLowerCase(),
                    price,
                }),
            );
        }

        return true;
    }
}
