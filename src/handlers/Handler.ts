import { BlockHeader, Log } from '@subsquid/evm-processor';

export default interface Handler {
    handle(log: Log, header: BlockHeader): Promise<boolean>;
}
