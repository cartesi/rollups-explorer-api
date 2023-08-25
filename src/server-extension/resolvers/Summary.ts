import { createLogger } from '@subsquid/logger';
import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityManager } from 'typeorm';
import { Application } from '../../model';

const LOG = createLogger('sqd:graphql-server:summary-resolver');

@ObjectType()
export class SummaryResult {
    @Field(() => Number, { nullable: false })
    totalApplications!: number;

    @Field(() => Number, { nullable: false })
    totalInputs!: number;

    constructor(props: Partial<SummaryResult>) {
        Object.assign(this, props);
    }
}

@Resolver()
export class SummaryResolver {
    constructor(private tx: () => Promise<EntityManager>) {}

    @Query(() => SummaryResult, { name: 'rollupsSummary' })
    async summaryQuery(): Promise<SummaryResult> {
        const manager = await this.tx();

        const result = await manager
            .getRepository(Application)
            .createQueryBuilder('application')
            .select('COUNT(application.id)', 'totalApplications')
            .addSelect('SUM(application.input_count)', 'totalInputs')
            .getRawOne();

        LOG.info(result);
        return result;
    }
}
