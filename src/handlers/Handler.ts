import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';

export default interface Handler {
    handle(
        log: Log,
        block: BlockData,
        context: DataHandlerContext<Store>,
    ): Promise<boolean>;
}
