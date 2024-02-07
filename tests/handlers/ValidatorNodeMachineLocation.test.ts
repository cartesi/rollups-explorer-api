import { EntityClass, FindOneOptions } from '@subsquid/typeorm-store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ValidatorNodeMachineLocation from '../../src/handlers/ValidatorNodeMachineLocation';
import { Application, Node, NodeProvider } from '../../src/model';
import {
    Logs,
    application,
    blockData,
    ctx,
    validatorNodeProvider,
} from '../stubs/validatorNodeProvider';

vi.mock('../../src/model/', async () => {
    const NodeProvider = vi.fn();
    const Node = vi.fn();
    const Application = vi.fn();
    const FunctionType = { READER: 'READER', VALIDATOR: 'VALIDATOR' };

    return {
        NodeProvider,
        Node,
        Application,
        FunctionType,
    };
});

const NodeMock = vi.mocked(Node);

describe('ValidatorNodeMachineLocation', () => {
    let handler: ValidatorNodeMachineLocation;
    const providersStorage = new Map<string, NodeProvider>();
    const nodesStorage = new Map<string, Node>();
    const applicationStorage = new Map<string, Application>();

    beforeEach(() => {
        NodeMock.mockImplementation((args) => ({ ...args } as Node));
        // defaults to find nothing in the "DB"
        vi.spyOn(ctx.store, 'get').mockResolvedValue(undefined);

        handler = new ValidatorNodeMachineLocation(
            applicationStorage,
            nodesStorage,
            providersStorage,
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
        providersStorage.clear();
        applicationStorage.clear();
        nodesStorage.clear();
    });

    it('should not create a validator-node when the provider does not exist', async () => {
        vi.spyOn(ctx.store, 'get').mockResolvedValue(undefined);

        expect(nodesStorage.size).toEqual(0);

        await handler.handle(Logs.machineLocation, blockData, ctx);

        expect(nodesStorage.size).toEqual(0);
    });

    it('should create the validator-node when the provider exist and set the node location', async () => {
        providersStorage.set(
            validatorNodeProvider.id,
            structuredClone(validatorNodeProvider),
        );
        applicationStorage.set(application.id, application);

        expect(nodesStorage.size).toEqual(0);

        await handler.handle(Logs.machineLocation, blockData, ctx);

        expect(nodesStorage.size).toEqual(1);
        const [[id, node]] = nodesStorage.entries();

        expect(node.id).toEqual(`${node.provider.id}-${node.application.id}`);
        expect(node.type).toEqual('VALIDATOR');
        expect(node.application).toBeDefined();
        expect(node.provider).toBeDefined();
        expect(node.location).toEqual(
            'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
        );
    });

    it('should create the validator-node with provider and application data from database', async () => {
        vi.spyOn(ctx.store, 'get').mockImplementation(
            async (
                entityClass: EntityClass<any>,
                id: FindOneOptions<any> | string,
            ): Promise<any | undefined> => {
                if (entityClass === Application) return application;
                if (entityClass === NodeProvider) return validatorNodeProvider;

                return undefined;
            },
        );

        await handler.handle(Logs.machineLocation, blockData, ctx);

        expect(nodesStorage.size).toEqual(1);
        const [[_, node]] = nodesStorage.entries();

        expect(node.application).toEqual(application);
        expect(node.provider).toEqual(validatorNodeProvider);
        expect(node.location).toEqual(
            'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
        );
    });
});
