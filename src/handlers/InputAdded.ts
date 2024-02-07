import { BlockData, DataHandlerContext, Log } from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import { dataSlice, getUint } from 'ethers';
import { Contract as ERC721 } from '../abi/ERC721';
import { events } from '../abi/InputBox';
import {
    ERC20PortalAddress,
    ERC721PortalAddress,
    InputBoxAddress,
} from '../config';
import {
    Application,
    Erc20Deposit,
    Erc721Deposit,
    Input,
    NFT,
    Token,
} from '../model';
import Handler from './Handler';
import TokenHelper from './helpers/TokenHelper';

const logErrorAndReturnNull =
    (ctx: DataHandlerContext<Store>) => (reason: any) => {
        ctx.log.error(reason);
        return null;
    };

export default class InputAdded implements Handler {
    constructor(
        private tokenStorage: Map<String, Token>,
        private depositStorage: Map<String, Erc20Deposit>,
        private applicationStorage: Map<String, Application>,
        private inputStorage: Map<String, Input>,
        private nftStorage: Map<String, NFT>,
        private erc721DepositStorage: Map<String, Erc721Deposit>,
    ) {}

    private async prepareErc20Deposit(
        input: Input,
        block: BlockData,
        ctx: DataHandlerContext<Store>,
        opts: {
            inputId: string;
        },
    ) {
        if (input.msgSender !== ERC20PortalAddress) return undefined;

        // first byte is a boolean and it is not used here at the moment
        const tokenAddress = dataSlice(input.payload, 1, 21).toLowerCase(); // 20 bytes for address
        const from = dataSlice(input.payload, 21, 41).toLowerCase(); // 20 bytes for address
        const amount = getUint(dataSlice(input.payload, 41, 73)); // 32 bytes for uint256

        let token = this.tokenStorage.get(tokenAddress) as Token;
        if (!token) {
            token = await TokenHelper.createToken(tokenAddress, ctx, block);
            this.tokenStorage.set(tokenAddress, token);
            ctx.log.info(`${tokenAddress} (Token) stored`);
        }
        const deposit = new Erc20Deposit({
            id: input.id,
            amount,
            from,
            token,
        });

        this.depositStorage.set(opts.inputId, deposit);
        ctx.log.info(`${opts.inputId} (Erc20Deposit) stored`);

        return deposit;
    }

    private async prepareErc721Deposit(
        input: Input,
        block: BlockData,
        ctx: DataHandlerContext<Store>,
        opts: {
            inputId: String;
        },
    ) {
        if (input.msgSender !== ERC721PortalAddress) return undefined;

        const tokenAddress = dataSlice(input.payload, 0, 20).toLowerCase(); // 20 bytes for address
        const from = dataSlice(input.payload, 20, 40).toLowerCase(); // 20 bytes for address
        const tokenIndex = getUint(dataSlice(input.payload, 40, 72)); // 32 bytes for uint256

        let nft = this.nftStorage.get(tokenAddress);
        if (!nft) {
            const contract = new ERC721(ctx, block.header, tokenAddress);
            const name = await contract
                .name()
                .catch(logErrorAndReturnNull(ctx));
            const symbol = await contract
                .symbol()
                .catch(logErrorAndReturnNull(ctx));
            nft = new NFT({ id: tokenAddress, name, symbol });
            this.nftStorage.set(tokenAddress, nft);
            ctx.log.info(`${tokenAddress} (NFT) stored`);
        }

        const deposit = new Erc721Deposit({
            id: input.id,
            from,
            token: nft,
            tokenIndex,
        });

        this.erc721DepositStorage.set(opts.inputId, deposit);
        ctx.log.info(`${opts.inputId} (Erc721Deposit) stored`);

        return deposit;
    }

    async handle(log: Log, block: BlockData, ctx: DataHandlerContext<Store>) {
        if (
            log.address === InputBoxAddress &&
            log.topics[0] === events.InputAdded.topic
        ) {
            const timestamp = BigInt(log.block.timestamp);
            const event = events.InputAdded.decode(log);
            const dappId = event.dapp.toLowerCase();
            const timestampInSeconds = timestamp / 1000n;

            let application =
                this.applicationStorage.get(dappId) ??
                (await ctx.store.get(Application, dappId));
            if (!application) {
                ctx.log.warn(`${dappId} (Application) not found`);
                application = new Application({
                    id: dappId,
                    timestamp: timestampInSeconds,
                });
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
                timestamp: timestampInSeconds,
                blockNumber: BigInt(log.block.height),
                blockHash: log.block.hash,
                transactionHash: log.transaction?.hash,
            });

            const params = [input, block, ctx, { inputId }] as const;

            input.erc20Deposit = await this.prepareErc20Deposit(...params);

            input.erc721Deposit = await this.prepareErc721Deposit(...params);

            this.inputStorage.set(inputId, input);
            ctx.log.info(`${inputId} (Input) stored`);
        }

        return true;
    }
}
