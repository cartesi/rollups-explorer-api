import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeProviderUnpaused from '../../src/handlers/ValidatorNodeProviderUnpaused';
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

describe('ValidatorNodeProviderUnpaused', () => {
    let handler: ValidatorNodeProviderUnpaused;
    const providerStorage = new Map<string, NodeProvider>();

    beforeEach(() => {
        handler = new ValidatorNodeProviderUnpaused(providerStorage);
    });

    afterEach(() => {
        vi.clearAllMocks();
        providerStorage.clear();
    });

    it('should from storage cache update the node property paused to false', async () => {
        const clonedProvider = structuredClone({
            ...validatorNodeProvider,
            paused: true,
        });
        providerStorage.set(validatorNodeProvider.id, clonedProvider);

        expect(clonedProvider.paused).toBeTruthy();

        await handler.handle(Logs.unpaused, blockData, ctx);

        const provider = providerStorage.get(validatorNodeProvider.id);

        expect(provider?.paused).toEqual(false);
    });

    it('should find the provider in the database and update the paused property to false', async () => {
        const copy = structuredClone({
            ...validatorNodeProvider,
            paused: true,
        });
        vi.spyOn(ctx.store, 'get').mockResolvedValueOnce(copy);

        await handler.handle(Logs.unpaused, blockData, ctx);

        expect(providerStorage.size).toBe(1);
        const provider = providerStorage.get(
            Logs.unpaused.address.toLowerCase(),
        );

        expect(provider?.paused).toEqual(false);
    });
});
