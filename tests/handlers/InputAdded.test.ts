import { dataSlice, getUint } from 'ethers';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Contract } from '../../src/abi/ERC20';
import InputAdded from '../../src/handlers/InputAdded';
import { Application, Erc20Deposit, Token } from '../../src/model/';
import { block, ctx, input } from '../stubs/params';
vi.mock('@subsquid/logger', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Logger = vi.fn();
    Logger.prototype.info = vi.fn();
    Logger.prototype.warn = vi.fn();
    return {
        ...actualMods!,
        Logger,
    };
});
vi.mock('../../src/abi/ERC20', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Contract = vi.fn();
    Contract.prototype.name = vi.fn();
    Contract.prototype.symbol = vi.fn();
    Contract.prototype.decimals = vi.fn();
    return {
        ...actualMods!,
        Contract,
    };
});
const tokenAddress = dataSlice(input.payload, 1, 21).toLowerCase(); // 20 bytes for address
const from = dataSlice(input.payload, 21, 41).toLowerCase(); // 20 bytes for address
const amount = getUint(dataSlice(input.payload, 41, 73)); // 32 bytes for uint256
describe('InputAdded', () => {
    let inputAdded: InputAdded;
    let erc20;
    const mockTokenStorage = new Map();
    const mockDepositStorage = new Map();
    const mockInputStorage = new Map();
    const mockApplicationStorage = new Map<string, Application>();
    beforeEach(() => {
        inputAdded = new InputAdded(
            mockTokenStorage,
            mockDepositStorage,
            mockApplicationStorage,
            mockInputStorage,
        );
        erc20 = new Contract(ctx, block.header, tokenAddress);
        mockTokenStorage.clear();
        mockDepositStorage.clear();
        mockApplicationStorage.clear();
        vi.clearAllMocks();
    });
    describe('handlePayload', async () => {
        test('call with the correct params', async () => {
            vi.spyOn(inputAdded, 'handlePayload');
            inputAdded.handlePayload(input, block, ctx);
            expect(inputAdded.handlePayload).toHaveBeenCalledWith(
                input,
                block,
                ctx,
            );
        });
        test('call the ERC20 module', async () => {
            await inputAdded.handlePayload(input, block, ctx);
            expect(erc20.name).toBeCalledTimes(1);
            expect(erc20.symbol).toBeCalledTimes(1);
            expect(erc20.decimals).toBeCalledTimes(1);
        });
        test('return the correct deposit value', async () => {
            const name = 'SimpleERC20';
            const symbol = 'SIM20';
            const decimals = 18;
            const token = new Token({
                id: tokenAddress,
                name,
                symbol,
                decimals,
            });
            const deposit = new Erc20Deposit({
                id: input.id,
                amount,
                from,
                token,
            });
            erc20.name.mockResolvedValueOnce('SimpleERC20');
            erc20.symbol.mockResolvedValue('SIM20');
            erc20.decimals.mockResolvedValue(18);
            const handlePayload = await inputAdded.handlePayload(
                input,
                block,
                ctx,
            );
            expect(handlePayload).toStrictEqual(deposit);
        });
        test('msgSender is not the correct ERC20PortalAddress', async () => {
            input.msgSender = '0x42985af528673AF020811c339Bf62497160Fe087';
            const handlePayload = await inputAdded.handlePayload(
                input,
                block,
                ctx,
            );
            expect(handlePayload).toBe(undefined);
        });
    });
    describe('handle', async () => {});
});
