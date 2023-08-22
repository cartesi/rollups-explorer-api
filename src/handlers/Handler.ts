import { Log } from '@subsquid/evm-processor';

export default interface Handler {
    handle(e: Log): Promise<boolean>;
}
