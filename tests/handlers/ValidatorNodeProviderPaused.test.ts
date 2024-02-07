import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeProviderPaused from '../../src/handlers/ValidatorNodeProviderPaused';
import { NodeProvider } from '../../src/model';
import {
    Logs,
    blockData,
    ctx,
    validatorNodeProvider,
} from '../stubs/validatorNodeProvider';

vi.mock('../../src/model/', async () => {
    const NodeProvider = vi.fn();
    const FunctionType = { READER: 'READER', VALIDATOR: 'VALIDATOR' };

    return {
        NodeProvider,
        FunctionType,
    };
});

describe('ValidatorNodeProviderPaused', () => {
    let handler: ValidatorNodeProviderPaused;
    const providerStorage = new Map<string, NodeProvider>();

    beforeEach(() => {
        handler = new ValidatorNodeProviderPaused(providerStorage);
    });

    afterEach(() => {
        vi.clearAllMocks();
        providerStorage.clear();
    });

    it('should from storage cache update the node property paused to true', async () => {
        providerStorage.set(
            validatorNodeProvider.id,
            structuredClone(validatorNodeProvider),
        );

        expect(validatorNodeProvider.paused).toBeFalsy();

        await handler.handle(Logs.paused, blockData, ctx);

        const provider = providerStorage.get(validatorNodeProvider.id);

        expect(provider?.paused).toEqual(true);
    });

    it('should find the provider in the database and update the paused property to true', async () => {
        const copy = structuredClone(validatorNodeProvider);
        vi.spyOn(ctx.store, 'get').mockResolvedValueOnce(copy);

        await handler.handle(Logs.paused, blockData, ctx);

        expect(providerStorage.size).toBe(1);
        const provider = providerStorage.get(Logs.paused.address.toLowerCase());

        expect(provider?.paused).toEqual(true);
    });
});
