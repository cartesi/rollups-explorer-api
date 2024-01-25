import { EntityClass, FindOneOptions } from '@subsquid/typeorm-store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeProviderCreated from '../../src/handlers/ValidatorNodeProviderCreated';
import TokenHelper from '../../src/handlers/helpers/TokenHelper';
import { Authority, Token, ValidatorNodeProvider } from '../../src/model';
import {
    Logs,
    TokenAddress,
    ValidatorNodeProviderAddress,
    authority,
    blockData,
    ctx,
    token,
    validatorNodeProvider,
} from '../stubs/validatorNodeProvider';

vi.mock('../../src/model/', async () => {
    const ValidatorNodeProvider = vi.fn();
    const Authority = vi.fn();
    const Token = vi.fn();

    return {
        ValidatorNodeProvider,
        Authority,
        Token,
    };
});

const ValidatorNodeProviderMock = vi.mocked(ValidatorNodeProvider);
const AuthorityMock = vi.mocked(Authority);

describe('ValidatorNodeProviderCreated', () => {
    let handler: ValidatorNodeProviderCreated;
    const providerStorage = new Map<string, ValidatorNodeProvider>();
    const tokenStorage = new Map<string, Token>();
    const authorityStorage = new Map<string, Authority>();
    const expectedProvider = {
        authority: {
            id: '0x83e4283f7eab201b06f749f683f27cfda294ab81',
        },
        id: '0x4d22c1f970574ae7b8724457d268d41e6459e288',
        paused: false,
        payee: '0xd8464d1b3592b6c3786b32931e2a2adac501aaad',
        price: 400000000000000n,
        token: {
            decimals: 18,
            id: '0xe15e2add14c26b9ae1e735bf5b444ccb11b0bd15',
            name: 'SunodoToken',
            symbol: 'SUN',
        },
    };

    beforeEach(() => {
        ValidatorNodeProviderMock.mockImplementation(
            (args) => ({ ...args } as ValidatorNodeProvider),
        );
        AuthorityMock.mockImplementation((args) => ({ ...args } as Authority));

        handler = new ValidatorNodeProviderCreated(
            authorityStorage,
            providerStorage,
            tokenStorage,
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
        providerStorage.clear();
        authorityStorage.clear();
        tokenStorage.clear();
    });

    it('should create the validator node with correct info including cache data', async () => {
        authorityStorage.set(authority.id, authority);
        tokenStorage.set(token.id, token);

        await handler.handle(Logs.created, blockData, ctx);

        const provider = providerStorage.get(validatorNodeProvider.id);

        expect(provider).toEqual(expectedProvider);
    });

    it('should create provider with correct information including authority and token info from database', async () => {
        vi.spyOn(ctx.store, 'get').mockImplementation(
            async (
                entityClass: EntityClass<any>,
                id: FindOneOptions<any> | string,
            ): Promise<any | undefined> => {
                if (entityClass === Authority) return { id };
                if (entityClass === Token) return token;

                return undefined;
            },
        );

        await handler.handle(Logs.created, blockData, ctx);

        expect(providerStorage.size).toBe(1);
        const provider = providerStorage.get(ValidatorNodeProviderAddress);

        expect(provider).toEqual(expectedProvider);
    });

    it('should create an authority when it is not indexed yet', async () => {
        tokenStorage.set(token.id, token);
        vi.spyOn(ctx.store, 'get').mockResolvedValue(undefined);

        expect(authorityStorage.size).toEqual(0);
        expect(providerStorage.size).toEqual(0);

        await handler.handle(Logs.created, blockData, ctx);

        expect(authorityStorage.size).toEqual(1);
        expect(providerStorage.size).toEqual(1);
    });

    it('should create a Token when it is not indexed yet', async () => {
        authorityStorage.set(authority.id, authority);
        vi.spyOn(TokenHelper, 'createToken').mockResolvedValue(token);

        expect(tokenStorage.size).toEqual(0);

        await handler.handle(Logs.created, blockData, ctx);

        expect(tokenStorage.size).toEqual(1);
        expect(providerStorage.size).toEqual(1);
        const expectedToken = tokenStorage.get(TokenAddress);
        const expectedProvider = providerStorage.get(
            ValidatorNodeProviderAddress,
        );

        expect(expectedToken).toEqual(expectedProvider?.token);
    });
});
