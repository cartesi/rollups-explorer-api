import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeProviderPaused from '../../src/handlers/ValidatorNodeProviderPaused';
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

describe('ValidatorNodeProviderPaused', () => {
    let handler: ValidatorNodeProviderPaused;
    const providerStorage = new Map<string, ValidatorNodeProvider>();

    beforeEach(() => {
        handler = new ValidatorNodeProviderPaused(providerStorage);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should from storage cache update the node property paused to true', () => {
        providerStorage.set(
            validatorNodeProvider.id,
            structuredClone(validatorNodeProvider),
        );

        expect(validatorNodeProvider.paused).toBeFalsy();

        handler.handle(Logs.paused, blockData, ctx);

        const provider = providerStorage.get(validatorNodeProvider.id);

        expect(provider?.paused).toEqual(true);
    });
});
