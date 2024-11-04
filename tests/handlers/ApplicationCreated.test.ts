import { sepolia } from 'viem/chains';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ApplicationCreated from '../../src/handlers/ApplicationCreated';
import {
    Application,
    ApplicationFactory,
    Chain,
    RollupVersion,
} from '../../src/model';
import { generateIDFrom } from '../../src/utils';
import { block, ctx, logs } from '../stubs/params';
import { mockModelImplementation } from '../stubs/utils';

vi.mock('../../src/model/', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Application = vi.fn();
    const ApplicationFactory = vi.fn();
    const Chain = vi.fn();
    const RollupVersion = { v1: 'v1', v2: 'v2' };

    return {
        ...actualMods!,
        Application,
        ApplicationFactory,
        Chain,
        RollupVersion,
    };
});

describe('ApplicationCreated', () => {
    let applicationCreated: ApplicationCreated;
    const mockFactoryStorage = new Map();
    const mockApplicationStorage = new Map();
    const mockChainStorage = new Map();

    beforeEach(() => {
        applicationCreated = new ApplicationCreated(
            mockFactoryStorage,
            mockApplicationStorage,
            mockChainStorage,
        );

        // Mock models to return simple Object when new Model() is called.
        mockModelImplementation(Application);
        mockModelImplementation(Chain);
        mockModelImplementation(ApplicationFactory);

        mockFactoryStorage.clear();
        mockApplicationStorage.clear();
        mockChainStorage.clear();
        vi.clearAllMocks();
    });

    describe('handle', async () => {
        test('should ignore events that are not of type application-created', async () => {
            await applicationCreated.handle(logs[0], block, ctx);
            expect(mockFactoryStorage.size).toBe(0);
            expect(mockApplicationStorage.size).toBe(0);
        });

        test('should create an chain object after handling application-created event', async () => {
            await applicationCreated.handle(logs[1], block, ctx);

            expect(mockChainStorage.size).toEqual(1);
            const [chain] = Array.from(mockChainStorage.values());
            expect(chain).toEqual({ id: sepolia.id.toString() });
        });

        test('should throw error when chain-id information is not available in the Log ', async () => {
            try {
                const clonedLog = structuredClone(logs[1]);
                delete clonedLog.transaction?.chainId;
                await applicationCreated.handle(clonedLog, block, ctx);
                expect(true).toEqual('Should not reach that expectation.');
            } catch (error) {
                expect(error.message).toEqual(
                    'Chain id is required to save ApplicationCreated events and related data!',
                );
            }
        });

        test('should create the entities after handling the application-created event', async () => {
            await applicationCreated.handle(logs[1], block, ctx);
            const factoryId = generateIDFrom([sepolia.id, logs[1].address]);
            const applicationId = generateIDFrom([
                sepolia.id,
                '0x0be010fa7e70d74fa8b6729fe1ae268787298f54',
                RollupVersion.v1,
            ]);

            expect(mockFactoryStorage.size).toBe(1);
            expect(mockApplicationStorage.size).toBe(1);
            expect(mockFactoryStorage.has(factoryId)).toBe(true);
            expect(mockApplicationStorage.has(applicationId)).toBe(true);

            const [factory] = Array.from(mockFactoryStorage.values());
            const [application] = Array.from(mockApplicationStorage.values());

            expect(factory).toEqual({
                id: factoryId,
                address: logs[1].address,
                chain: { id: sepolia.id.toString() },
            });
            expect(application).toEqual({
                id: applicationId,
                address: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54',
                factory: factory,
                owner: '0x74d093f6911ac080897c3145441103dabb869307',
                timestamp: 1696281168n,
                chain: { id: sepolia.id.toString() },
                rollupVersion: 'v1',
            });
        });

        test('should set the timestamp in seconds from the block timestamp', async () => {
            await applicationCreated.handle(logs[1], block, ctx);
            const applicationId = generateIDFrom([
                sepolia.id,
                '0x0be010fa7e70d74fa8b6729fe1ae268787298f54',
                RollupVersion.v1,
            ]);

            const timestampInSeconds = BigInt(logs[1].block.timestamp) / 1000n;

            const [application] = Array.from(mockApplicationStorage.values());

            expect(application).toEqual({
                factory: {
                    id: '11155111-0x7122cd1221c20892234186facfe8615e6743ab02',
                    address: '0x7122cd1221c20892234186facfe8615e6743ab02',
                    chain: { id: sepolia.id.toString() },
                },
                id: applicationId,
                owner: '0x74d093f6911ac080897c3145441103dabb869307',
                timestamp: timestampInSeconds,
                address: '0x0be010fa7e70d74fa8b6729fe1ae268787298f54',
                chain: { id: sepolia.id.toString() },
                rollupVersion: 'v1',
            });
        });
    });
});
