import { dataSlice, getUint } from 'ethers';
import { afterEach } from 'node:test';
import { MockedObject, beforeEach, describe, expect, test, vi } from 'vitest';
import { Contract } from '../../src/abi/ERC20';
import { Contract as ERC721 } from '../../src/abi/ERC721';
import InputAdded from '../../src/handlers/InputAdded';
import {
    Application,
    Erc20Deposit,
    Erc721Deposit,
    Input,
    NFT,
    Token,
} from '../../src/model';
import { block, ctx, input, logErc721Transfer, logs } from '../stubs/params';

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

vi.mock('../../src/abi/ERC721', async (importOriginal) => {
    const Contract = vi.fn();

    Contract.prototype.name = vi.fn();
    Contract.prototype.symbol = vi.fn();

    return {
        Contract,
    };
});

vi.mock('../../src/model/', async () => {
    const Token = vi.fn();
    const Erc20Deposit = vi.fn();
    const Application = vi.fn();
    const Input = vi.fn();
    const Erc721Deposit = vi.fn();
    const NFT = vi.fn();
    return {
        Application,
        Token,
        Erc20Deposit,
        Erc721Deposit,
        Input,
        NFT,
    };
});

const ApplicationMock = vi.mocked(Application);
const InputMock = vi.mocked(Input);
const NFTStub = vi.mocked(NFT);
const ERC721DepositStub = vi.mocked(Erc721Deposit);

const tokenAddress = dataSlice(input.payload, 1, 21).toLowerCase(); // 20 bytes for address
const from = dataSlice(input.payload, 21, 41).toLowerCase(); // 20 bytes for address
const amount = getUint(dataSlice(input.payload, 41, 73)); // 32 bytes for uint256

describe('InputAdded', () => {
    let inputAdded: InputAdded;
    let erc20;
    let erc721: MockedObject<ERC721>;
    const mockTokenStorage = new Map();
    const mockDepositStorage = new Map();
    const mockInputStorage = new Map();
    const mockApplicationStorage = new Map();

    beforeEach(() => {
        inputAdded = new InputAdded(
            mockTokenStorage,
            mockDepositStorage,
            mockApplicationStorage,
            mockInputStorage,
        );
        erc20 = new Contract(ctx, block.header, tokenAddress);
        erc721 = vi.mocked(new ERC721(ctx, block.header, tokenAddress));
        mockTokenStorage.clear();
        mockDepositStorage.clear();
        mockApplicationStorage.clear();
        mockInputStorage.clear();
        vi.clearAllMocks();
    });
    describe('handlePayload(log)', async () => {
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

    describe('handle', async () => {
        test('call with the correct params', async () => {
            vi.spyOn(inputAdded, 'handle');
            inputAdded.handle(logs[0], block, ctx);
            expect(inputAdded.handle).toBeCalledWith(logs[0], block, ctx);
        });

        test('wrong contract address', async () => {
            await inputAdded.handle(logs[1], block, ctx);
            expect(mockInputStorage.size).toBe(0);
            expect(mockApplicationStorage.size).toBe(0);
            expect(mockDepositStorage.size).toBe(0);
        });

        test('correct contract address', async () => {
            await inputAdded.handle(logs[0], block, ctx);
            expect(mockApplicationStorage.size).toBe(1);
            expect(mockInputStorage.size).toBe(1);
        });

        test('Erc20Deposit Stored', async () => {
            const name = 'SimpleERC20';
            const symbol = 'SIM20';
            const decimals = 18;
            const token = new Token({
                id: tokenAddress,
                name,
                symbol,
                decimals,
            });
            erc20.name.mockResolvedValueOnce('SimpleERC20');
            erc20.symbol.mockResolvedValue('SIM20');
            erc20.decimals.mockResolvedValue(18);
            const deposit = new Erc20Deposit({
                id: input.id,
                amount,
                from,
                token,
            });
            vi.spyOn(inputAdded, 'handlePayload').mockImplementation(
                (input, block, ctx) => {
                    return new Promise((resolve) => {
                        resolve(deposit);
                    });
                },
            );
            await inputAdded.handle(logs[0], block, ctx);
            expect(mockDepositStorage.size).toBe(1);
        });

        test('when creating a non-existing app it should also set the timestamp in seconds', async () => {
            const expectedParams = vi.fn();

            ApplicationMock.mockImplementationOnce((args) => {
                expectedParams(args);
                return new Application(args);
            });

            await inputAdded.handle(logs[0], block, ctx);

            const timestamp = BigInt(logs[0].block.timestamp) / 1000n;

            expect(expectedParams).toHaveBeenCalledWith({
                id: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54',
                timestamp,
            });
        });

        describe('ERC-721 deposits', () => {
            const name = 'BrotherNFT';
            const symbol = 'BRUH';

            beforeEach(() => {
                erc721.name.mockResolvedValue(name);
                erc721.symbol.mockResolvedValue(symbol);

                // Returning simple object as the Class type for assertion
                InputMock.mockImplementationOnce((args) => {
                    return { ...args } as Input;
                });

                NFTStub.mockImplementationOnce((args) => {
                    return { ...args } as NFT;
                });

                ERC721DepositStub.mockImplementationOnce((args) => {
                    return { ...args } as Erc721Deposit;
                });
            });

            afterEach(() => {
                vi.clearAllMocks();
            });

            test('should store the token information', async () => {
                await inputAdded.handle(logErc721Transfer, block, ctx);

                expect(mockTokenStorage.size).toBe(1);
                const token = mockTokenStorage.values().next().value;
                expect(token.name).toEqual(name);
                expect(token.symbol).toEqual(symbol);
            });

            test('should store the deposit information', async () => {
                await inputAdded.handle(logErc721Transfer, block, ctx);

                expect(mockDepositStorage.size).toBe(1);
                const deposit = mockDepositStorage.values().next().value;
                expect(deposit.id).toEqual(
                    '0x0be010fa7e70d74fa8b6729fe1ae268787298f54-1',
                );
                expect(deposit.from).toEqual(
                    logErc721Transfer.transaction.from,
                );
                expect(deposit.tokenIndex).toEqual(1n);
                expect(deposit.token).toEqual({
                    id: '0x7a3cc9c0408887a030a0354330c36a9cd681aa7e',
                    name,
                    symbol,
                });
            });

            test('should assign the erc721 deposit information correctly into the input', async () => {
                await inputAdded.handle(logErc721Transfer, block, ctx);

                expect(mockInputStorage.size).toBe(1);
                const input = mockInputStorage.values().next().value;
                expect(input.erc721Deposit).toEqual({
                    from: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                    id: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54-1',
                    token: {
                        id: '0x7a3cc9c0408887a030a0354330c36a9cd681aa7e',
                        name,
                        symbol,
                    },
                    tokenIndex: 1n,
                });
            });

            test('should handle the absence of name and symbol methods in the ERC-721 contract', async () => {
                erc721.name.mockRejectedValue(
                    new Error('No name method implemented on contract'),
                );
                erc721.symbol.mockRejectedValue(
                    new Error('No symbol method implemented on contract'),
                );

                await inputAdded.handle(logErc721Transfer, block, ctx);

                expect(mockInputStorage.size).toBe(1);
                const input = mockInputStorage.values().next().value;
                expect(input.erc721Deposit).toEqual({
                    from: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                    id: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54-1',
                    token: {
                        id: '0x7a3cc9c0408887a030a0354330c36a9cd681aa7e',
                        name: null,
                        symbol: null,
                    },
                    tokenIndex: 1n,
                });
            });
        });
    });
});
