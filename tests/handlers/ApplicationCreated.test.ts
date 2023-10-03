import { beforeEach, describe, expect, test, vi } from 'vitest';
import ApplicationCreated from '../../src/handlers/ApplicationCreated';
import { block, ctx, logs } from '../stubs/params';

vi.mock('../../src/model/', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Application = vi.fn();
    const ApplicationFactory = vi.fn();
    return {
        ...actualMods!,
        Application,
        ApplicationFactory,
    };
});

describe('ApplicationCreated', () => {
    let applicationCreated: ApplicationCreated;
    const mockFactoryStorage = new Map();
    const mockApplicationStorage = new Map();
    beforeEach(() => {
        applicationCreated = new ApplicationCreated(
            mockFactoryStorage,
            mockApplicationStorage,
        );
        mockFactoryStorage.clear();
        mockApplicationStorage.clear();
        vi.clearAllMocks();
    });
    describe('handle', async () => {
        test('call with correct params', async () => {
            vi.spyOn(applicationCreated, 'handle');
            applicationCreated.handle(logs[0], block, ctx);
            expect(applicationCreated.handle).toHaveBeenCalledWith(
                logs[0],
                block,
                ctx,
            );
        });
        test('wrong contract address', async () => {
            await applicationCreated.handle(logs[0], block, ctx);
            expect(mockFactoryStorage.size).toBe(0);
            expect(mockApplicationStorage.size).toBe(0);
        });
        test('correct contract address', async () => {
            await applicationCreated.handle(logs[1], block, ctx);
            const applicationId = '0x0be010fa7e70d74fa8b6729fe1ae268787298f54';
            expect(mockFactoryStorage.size).toBe(1);
            expect(mockApplicationStorage.size).toBe(1);
            expect(mockFactoryStorage.has(logs[1].address)).toBe(true);
            expect(mockApplicationStorage.has(applicationId)).toBe(true);
        });
    });
});
