import { beforeEach, describe, expect, test, vi } from 'vitest';

import OwnerShipTransferred from '../../src/handlers/OwnershipTransferred';
import { block, ctx, logs } from '../stubs/params';

vi.mock('../../src/model/', async (importOriginal) => {
    const actualMods = await importOriginal;
    const Application = vi.fn();
    return {
        ...actualMods!,
        Application,
    };
});

describe('ApplicationCreated', () => {
    let ownershipTransferred: OwnerShipTransferred;
    const mockApplicationStorage = new Map();
    beforeEach(() => {
        ownershipTransferred = new OwnerShipTransferred(mockApplicationStorage);
        mockApplicationStorage.clear();
        vi.clearAllMocks();
    });
    describe('handle', async () => {
        test('call with correct params', async () => {
            vi.spyOn(ownershipTransferred, 'handle');
            ownershipTransferred.handle(logs[2], block, ctx);
            expect(ownershipTransferred.handle).toHaveBeenCalledWith(
                logs[2],
                block,
                ctx,
            );
        });
        test('wrong contract address', async () => {
            await ownershipTransferred.handle(logs[0], block, ctx);
            expect(mockApplicationStorage.size).toBe(0);
        });
        test('Ownership Transferred', async () => {
            const mockApplicationStorage2 = new Map();
            const appId = logs[2].transaction.to;
            mockApplicationStorage2.set(appId, {
                id: appId,
                owner: '0xf05d57a5bed2d1b529c56001fc5810cc9afc0335',
                factory: {
                    id: '0x7122cd1221c20892234186facfe8615e6743ab02',
                },
            });
            const ownerMock = new OwnerShipTransferred(mockApplicationStorage2);
            await ownerMock.handle(logs[2], block, ctx);
            expect(mockApplicationStorage2.get(appId).owner).not.toBe(
                '0xf05d57a5bed2d1b529c56001fc5810cc9afc0335',
            );
        });
    });
});
