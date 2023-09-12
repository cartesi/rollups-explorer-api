import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { dataSlice, getNumber, getUint } from 'ethers';
import { Contract as ERC20 } from '../abi/ERC20';
import { events } from '../abi/InputBox';
import { ERC20PortalAddress, InputBoxAddress } from '../config';
import { Application, Erc20Deposit, Input, Token } from '../model';
import Handler from './Handler';

export default class InputAdded implements Handler {
    constructor(
        private tokenStorage: Map<String, Token>,
        private depositStorage: Map<String, Erc20Deposit>,
        private applicationStorage: Map<String, Application>,
        private inputStorage: Map<String, Input>,
    ) {}

    async handlePayload(
        input: Input,
        block: BlockData,
        ctx: DataHandlerContext<Store>,
    ) {
        if (input.msgSender == ERC20PortalAddress) {
            const success = getNumber(dataSlice(input.payload, 0, 1)) == 1; // 1 byte for boolean (not used?)
            const tokenAddress = dataSlice(input.payload, 1, 21).toLowerCase(); // 20 bytes for address
            const from = dataSlice(input.payload, 21, 41).toLowerCase(); // 20 bytes for address
            const amount = getUint(dataSlice(input.payload, 41, 73)); // 32 bytes for uint256

            let token = this.tokenStorage.get(tokenAddress);
            if (!token) {
                const contract = new ERC20(ctx, block.header, tokenAddress);
                const name = await contract.name();
                const symbol = await contract.symbol();
                const decimals = await contract.decimals();
                token = new Token({ id: tokenAddress, name, symbol, decimals });
                this.tokenStorage.set(tokenAddress, token);
                ctx.log.info(`${tokenAddress} (Token) stored`);
            }
            const deposit = new Erc20Deposit({
                id: input.id,
                amount,
                from,
                token,
            });
            return deposit;
        }
        return undefined;
    }

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === InputBoxAddress &&
            log.topics[0] === events.InputAdded.topic
        ) {
            const timestamp = BigInt(log.block.timestamp);
            const event = events.InputAdded.decode(log);
            const dappId = event.dapp.toLowerCase();

            let application =
                this.applicationStorage.get(dappId) ??
                (await ctx.store.get(Application, dappId));
            if (!application) {
                ctx.log.warn(`${dappId} (Application) not found`);
                application = new Application({ id: dappId });
                this.applicationStorage.set(dappId, application);
                ctx.log.info(`${dappId} (Application) stored`);
            }

            const inputId = `${dappId}-${event.inboxInputIndex}`;
            const input = new Input({
                id: inputId,
                application,
                index: Number(event.inboxInputIndex),
                msgSender: event.sender.toLowerCase(),
                payload: event.input,
                timestamp: timestamp / 1000n,
                blockNumber: BigInt(log.block.height),
                blockHash: log.block.hash,
                transactionHash: log.transaction?.hash,
            });
            const erc20Deposit = await this.handlePayload(input, block, ctx);
            if (erc20Deposit) {
                this.depositStorage.set(inputId, erc20Deposit);
                ctx.log.info(`${inputId} (Erc20Deposit) stored`);
                input.erc20Deposit = erc20Deposit;
            }
            this.inputStorage.set(inputId, input);
            ctx.log.info(`${inputId} (Input) stored`);
        }

        return true;
    }
}
