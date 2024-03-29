import { afterEach } from 'node:test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Contract as ERC20 } from '../../src/abi/ERC20';
import { Contract as ERC721 } from '../../src/abi/ERC721';
import InputAdded from '../../src/handlers/InputAdded';
import {
    Application,
    Erc1155Deposit,
    Erc1155Transfer,
    Erc20Deposit,
    Erc721Deposit,
    Input,
    MultiToken,
    NFT,
    Token,
} from '../../src/model';
import {
    block,
    ctx,
    logErc1155BatchTransfer,
    logErc1155SingleTransfer,
    logErc20Transfer,
    logErc721Transfer,
    logs,
} from '../stubs/params';

vi.mock('../../src/abi/ERC20');

vi.mock('../../src/abi/ERC721');

vi.mock('../../src/model/', async () => {
    const Token = vi.fn();
    const Erc20Deposit = vi.fn();
    const Application = vi.fn();
    const Input = vi.fn();
    const Erc721Deposit = vi.fn();
    const NFT = vi.fn();
    const Erc1155Deposit = vi.fn();
    const MultiToken = vi.fn();
    const Erc1155Transfer = vi.fn();

    return {
        Application,
        Token,
        Erc20Deposit,
        Erc721Deposit,
        Input,
        NFT,
        MultiToken,
        Erc1155Deposit,
        Erc1155Transfer,
    };
});

const ApplicationMock = vi.mocked(Application);
const InputMock = vi.mocked(Input);
const NFTStub = vi.mocked(NFT);
const ERC721Mock = vi.mocked(ERC721, true);
const ERC721DepositStub = vi.mocked(Erc721Deposit);
const ERC20Mock = vi.mocked(ERC20, true);
const ERC20DepositStub = vi.mocked(Erc20Deposit);
const TokenStub = vi.mocked(Token);
const MultiTokenStub = vi.mocked(MultiToken);
const ERC1155DepositStub = vi.mocked(Erc1155Deposit);
const ERC1155TransferStub = vi.mocked(Erc1155Transfer);

describe('InputAdded', () => {
    let inputAdded: InputAdded;
    const mockTokenStorage = new Map();
    const mockDepositStorage = new Map();
    const mockInputStorage = new Map();
    const mockApplicationStorage = new Map();
    const mockNftStorage = new Map();
    const mockErc721DepositStorage = new Map();
    const mockMultiTokenStorage = new Map<string, MultiToken>();
    const mockErc1155DepositStorage = new Map<string, Erc1155Deposit>();

    beforeEach(() => {
        inputAdded = new InputAdded(
            mockTokenStorage,
            mockDepositStorage,
            mockApplicationStorage,
            mockInputStorage,
            mockNftStorage,
            mockErc721DepositStorage,
            mockMultiTokenStorage,
            mockErc1155DepositStorage,
        );

        mockTokenStorage.clear();
        mockDepositStorage.clear();
        mockApplicationStorage.clear();
        mockInputStorage.clear();
        mockNftStorage.clear();
        mockErc721DepositStorage.clear();
        mockMultiTokenStorage.clear();
        mockErc1155DepositStorage.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('handle', async () => {
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

        describe('ERC-20 deposit', () => {
            const name = 'Wrapped Ether';
            const symbol = 'WETH';
            const decimals = 18;

            beforeEach(() => {
                InputMock.mockImplementationOnce((args) => {
                    return { ...args } as Input;
                });
                TokenStub.mockImplementation((args) => ({ ...args } as Token));
                ERC20DepositStub.mockImplementation(
                    (args) => ({ ...args } as Erc20Deposit),
                );

                // some default returns for the ERC20 contract calls
                ERC20Mock.prototype.name.mockResolvedValue(name);
                ERC20Mock.prototype.symbol.mockResolvedValue(symbol);
                ERC20Mock.prototype.decimals.mockResolvedValue(decimals);
            });

            afterEach(() => {
                vi.clearAllMocks();
            });

            test('Should store the token information', async () => {
                await inputAdded.handle(logErc20Transfer, block, ctx);
                expect(mockTokenStorage.size).toBe(1);
                const token = mockTokenStorage.values().next().value;

                expect(token.name).toEqual(name);
                expect(token.symbol).toEqual(symbol);
                expect(token.decimals).toEqual(decimals);
            });

            test('should store the deposit information', async () => {
                await inputAdded.handle(logErc20Transfer, block, ctx);

                expect(mockDepositStorage.size).toBe(1);
                const deposit = mockDepositStorage.values().next().value;

                expect(deposit).toEqual({
                    id: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54-1',
                    amount: 111000000000000000n,
                    from: '0xf9e958241c1ca380cfcd50170ec43974bded0bff',
                    token: {
                        id: '0x813ae0539daf858599a1b2a7083380542a7b1bb5',
                        decimals: 18,
                        name: 'Wrapped Ether',
                        symbol: 'WETH',
                    },
                });
            });

            test('should assign the erc20 deposit information correctly into the input', async () => {
                await inputAdded.handle(logErc20Transfer, block, ctx);

                expect(mockInputStorage.size).toEqual(1);
                const input = mockInputStorage.values().next().value as Input;

                expect(input.erc20Deposit).toEqual({
                    amount: 111000000000000000n,
                    from: '0xf9e958241c1ca380cfcd50170ec43974bded0bff',
                    id: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54-1',
                    token: {
                        decimals: 18,
                        id: '0x813ae0539daf858599a1b2a7083380542a7b1bb5',
                        name: 'Wrapped Ether',
                        symbol: 'WETH',
                    },
                });

                expect(input.erc721Deposit).toBeUndefined;
            });
        });

        describe('ERC-721 deposits', () => {
            const name = 'BrotherNFT';
            const symbol = 'BRUH';

            beforeEach(() => {
                ERC721Mock.prototype.name.mockResolvedValue(name);
                ERC721Mock.prototype.symbol.mockResolvedValue(symbol);

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

                expect(mockNftStorage.size).toBe(1);
                const token = mockNftStorage.values().next().value;
                expect(token.name).toEqual(name);
                expect(token.symbol).toEqual(symbol);
            });

            test('should store the deposit information', async () => {
                await inputAdded.handle(logErc721Transfer, block, ctx);

                expect(mockErc721DepositStorage.size).toBe(1);
                const deposit = mockErc721DepositStorage.values().next().value;
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
                ERC721Mock.prototype.name.mockRejectedValue(
                    new Error('No name method implemented on contract'),
                );
                ERC721Mock.prototype.symbol.mockRejectedValue(
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

        describe('ERC-1155 deposits', () => {
            const tokenAddress = '0x2960f4db2b0993ae5b59bc4a0f5ec7a1767e905e';

            beforeEach(() => {
                // Returning simple object as the Class type for assertion
                InputMock.mockImplementationOnce((args) => {
                    return { ...args } as Input;
                });

                MultiTokenStub.mockImplementationOnce((args) => {
                    return { ...args } as MultiToken;
                });

                ERC1155TransferStub.mockImplementation((args) => {
                    return { ...args } as Erc1155Transfer;
                });

                ERC1155DepositStub.mockImplementationOnce((args) => {
                    return { ...args } as Erc1155Deposit;
                });
            });

            afterEach(() => {
                vi.clearAllMocks();
            });

            test('should store the token information', async () => {
                expect(mockMultiTokenStorage.size).toBe(0);

                await inputAdded.handle(logErc1155SingleTransfer, block, ctx);

                expect(mockMultiTokenStorage.size).toBe(1);
                const token = mockMultiTokenStorage.get(tokenAddress);
                expect(token?.id).toEqual(tokenAddress);
            });

            test('should store the deposit information for single transfer', async () => {
                const inputId =
                    '0x4ca2f6935200b9a782a78f408f640f17b29809d8-783';
                expect(mockErc1155DepositStorage.size).toBe(0);
                await inputAdded.handle(logErc1155SingleTransfer, block, ctx);

                expect(mockErc1155DepositStorage.size).toBe(1);

                const deposit = mockErc1155DepositStorage.get(inputId);

                expect(deposit).toEqual({
                    from: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                    id: inputId,
                    token: {
                        id: '0x2960f4db2b0993ae5b59bc4a0f5ec7a1767e905e',
                    },
                    transfers: [
                        {
                            amount: 10000000n,
                            tokenIndex: 2n,
                        },
                    ],
                });
            });

            test('should store the deposit information for batch transfer', async () => {
                const inputId =
                    '0x4ca2f6935200b9a782a78f408f640f17b29809d8-784';
                expect(mockErc1155DepositStorage.size).toBe(0);
                await inputAdded.handle(logErc1155BatchTransfer, block, ctx);

                expect(mockErc1155DepositStorage.size).toBe(1);

                const deposit = mockErc1155DepositStorage.get(inputId);

                expect(deposit).toEqual({
                    from: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
                    id: inputId,
                    token: {
                        id: '0x2960f4db2b0993ae5b59bc4a0f5ec7a1767e905e',
                    },
                    transfers: [
                        {
                            amount: 100n,
                            tokenIndex: 0n,
                        },
                        {
                            amount: 1000n,
                            tokenIndex: 1n,
                        },
                        {
                            amount: 10000n,
                            tokenIndex: 2n,
                        },
                    ],
                });
            });
        });
    });
});
