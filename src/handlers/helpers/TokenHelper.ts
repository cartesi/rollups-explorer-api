import { BlockData, DataHandlerContext } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { Contract as ERC20 } from '../../abi/ERC20';
import { Token } from '../../model';

export default class TokenHelper {
    static async createToken(
        address: string,
        ctx: DataHandlerContext<Store>,
        block: BlockData<{}>,
    ) {
        const token = new ERC20(ctx, block.header, address);
        const [name, symbol, decimals] = await Promise.allSettled([
            token.name(),
            token.symbol(),
            token.decimals(),
        ]).then(
            (results) =>
                results.map((r) =>
                    r.status === 'fulfilled' ? r.value : undefined,
                ) as [string?, string?, number?],
        );

        return new Token({
            id: address.toString(),
            name,
            symbol,
            decimals,
        });
    }
}