/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from ".";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@prisma/client';
import type { UseTRPCMutationOptions, UseTRPCMutationResult, UseTRPCQueryOptions, UseTRPCQueryResult, UseTRPCInfiniteQueryOptions, UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({

        createMany: procedure.input($Schema.OrderItemInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.createMany(input as any))),

        create: procedure.input($Schema.OrderItemInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.create(input as any))),

        deleteMany: procedure.input($Schema.OrderItemInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.deleteMany(input as any))),

        delete: procedure.input($Schema.OrderItemInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.delete(input as any))),

        findFirst: procedure.input($Schema.OrderItemInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).orderItem.findFirst(input as any))),

        findMany: procedure.input($Schema.OrderItemInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).orderItem.findMany(input as any))),

        findUnique: procedure.input($Schema.OrderItemInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).orderItem.findUnique(input as any))),

        updateMany: procedure.input($Schema.OrderItemInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.updateMany(input as any))),

        update: procedure.input($Schema.OrderItemInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).orderItem.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.OrderItemCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.OrderItemCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderItemGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderItemGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderItemGetPayload<T>, Context>) => Promise<Prisma.OrderItemGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.OrderItemDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.OrderItemDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderItemGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderItemGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderItemGetPayload<T>, Context>) => Promise<Prisma.OrderItemGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.OrderItemFindFirstArgs, TData = Prisma.OrderItemGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.OrderItemFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OrderItemGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderItemFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderItemFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OrderItemGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OrderItemGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.OrderItemFindManyArgs, TData = Array<Prisma.OrderItemGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.OrderItemFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.OrderItemGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderItemFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderItemFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.OrderItemGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.OrderItemGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.OrderItemFindUniqueArgs, TData = Prisma.OrderItemGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.OrderItemFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OrderItemGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderItemFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderItemFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OrderItemGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OrderItemGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.OrderItemUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.OrderItemUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderItemUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderItemGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderItemGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderItemUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderItemUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderItemGetPayload<T>, Context>) => Promise<Prisma.OrderItemGetPayload<T>>
            };

    };
}
