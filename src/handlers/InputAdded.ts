import { BlockHeader, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { dataSlice, getNumber, getUint } from 'ethers';
import { Contract as ERC20 } from '../abi/ERC20';
import { events } from '../abi/InputBox';
import { LogRecord } from '../abi/abi.support';
import { ERC20PortalAddress, Event, InputBoxAddress } from '../config';
import { Application, Erc20Deposit, Input, Token } from '../model';
import Handler from './Handler';

export default class InputAdded implements Handler {
    constructor(
        private readonly ctx: DataHandlerContext<Store>,
        private tokensStorage: Map<String, Token>,
        private depositsStorage: Map<String, Erc20Deposit>,
        private dappsStorage: Map<String, Application>,
        private inputsStorage: Map<String, Input>,
    ) {}

    private decodeLog(evmLog: LogRecord) {
        return events.InputAdded.decode(evmLog);
    }

    async handlePayload(input: Input, header: BlockHeader) {
        if (input.msgSender == ERC20PortalAddress) {
            const success = getNumber(dataSlice(input.payload, 0, 1)) == 1; // 1 byte for boolean
            const tokenAddress = dataSlice(input.payload, 1, 21).toLowerCase(); // 20 bytes for address
            const from = dataSlice(input.payload, 21, 41).toLowerCase(); // 20 bytes for address
            const amount = getUint(dataSlice(input.payload, 41, 73)); // 32 bytes for uint256

            let token = this.tokensStorage.get(tokenAddress);
            if (!token) {
                const contract = new ERC20(this.ctx, header, tokenAddress);
                const name = await contract.name();
                const symbol = await contract.symbol();
                const decimals = await contract.decimals();
                token = new Token({ id: tokenAddress, name, symbol, decimals });
                this.tokensStorage.set(tokenAddress, token);
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

    async handle(e: Log, header: BlockHeader) {
        if (
            e.address === InputBoxAddress &&
            e.topics[0] === Event.InputBox.InputAdded
        ) {
            const timestamp = BigInt(e.block.timestamp);
            const ctx = this.ctx;
            ctx.log.info(`Indexing InputBox InputAdded event`);
            const inputEvent = this.decodeLog(e);
            const dappId = inputEvent.dapp.toLowerCase();

            let dapp =
                this.dappsStorage.get(dappId) ??
                (await ctx.store.get(Application, dappId));
            if (dapp) {
                ctx.log.info(`Dapp:${dappId} found`);
                dapp.inputCount += 1;
                dapp.activityTimestamp = timestamp;
            } else {
                ctx.log.warn(
                    `Dapp:${dappId} not found... created by input event`,
                );
                dapp = new Application({
                    id: dappId,
                    activityTimestamp: timestamp,
                    deploymentTimestamp: timestamp,
                    inputCount: 1,
                });
            }

            const inputId = `${dappId}-${inputEvent.inboxInputIndex}`;
            const input = new Input({
                id: inputId,
                application: dapp,
                index: Number(inputEvent.inboxInputIndex),
                msgSender: inputEvent.sender.toLowerCase(),
                payload: inputEvent.input,
                timestamp: timestamp / 1000n,
                blockNumber: BigInt(e.block.height),
                blockHash: e.block.hash,
                transactionHash: e.transaction?.hash,
            });
            const erc20Deposit = await this.handlePayload(input, header);
            if (erc20Deposit) {
                this.depositsStorage.set(inputId, erc20Deposit);
                input.erc20Deposit = erc20Deposit;
            }
            this.inputsStorage.set(inputId, input);
            this.dappsStorage.set(dappId, dapp);
        }

        return true;
    }
}
