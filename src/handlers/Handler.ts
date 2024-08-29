import { DataHandlerContext } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockData, Log } from '../processor';

export default interface Handler {
    handle(
        log: Log,
        block: BlockData,
        context: DataHandlerContext<Store>,
    ): Promise<boolean>;
}
