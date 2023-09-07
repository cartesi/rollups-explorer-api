import { BlockHeader, Log } from '@subsquid/evm-processor';

export default interface Handler {
    handle(e: Log, header: BlockHeader): Promise<boolean>;
}
