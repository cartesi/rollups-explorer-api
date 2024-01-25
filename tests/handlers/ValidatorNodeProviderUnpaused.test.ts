import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeProviderUnpaused from '../../src/handlers/ValidatorNodeProviderUnpaused';
import { ValidatorNodeProvider } from '../../src/model';
import {
    Logs,
    blockData,
    ctx,
    validatorNodeProvider,
} from '../stubs/validatorNodeProvider';

vi.mock('../../src/model/', async () => {
    const ValidatorNodeProvider = vi.fn();

    return {
        ValidatorNodeProvider,
    };
});

describe('ValidatorNodeProviderUnpaused', () => {
    let handler: ValidatorNodeProviderUnpaused;
    const providerStorage = new Map<string, ValidatorNodeProvider>();

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
