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

        createMany: procedure.input($Schema.OrderInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.createMany(input as any))),

        create: procedure.input($Schema.OrderInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.create(input as any))),

        deleteMany: procedure.input($Schema.OrderInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.deleteMany(input as any))),

        delete: procedure.input($Schema.OrderInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.delete(input as any))),

        findFirst: procedure.input($Schema.OrderInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).order.findFirst(input as any))),

        findMany: procedure.input($Schema.OrderInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).order.findMany(input as any))),

        findUnique: procedure.input($Schema.OrderInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).order.findUnique(input as any))),

        updateMany: procedure.input($Schema.OrderInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.updateMany(input as any))),

        update: procedure.input($Schema.OrderInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).order.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.OrderCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.OrderCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderGetPayload<T>, Context>) => Promise<Prisma.OrderGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.OrderDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.OrderDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderGetPayload<T>, Context>) => Promise<Prisma.OrderGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.OrderFindFirstArgs, TData = Prisma.OrderGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.OrderFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OrderGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OrderGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OrderGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.OrderFindManyArgs, TData = Array<Prisma.OrderGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.OrderFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.OrderGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.OrderGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.OrderGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.OrderFindUniqueArgs, TData = Prisma.OrderGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.OrderFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OrderGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OrderFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OrderFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OrderGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OrderGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.OrderUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.OrderUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OrderUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OrderGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OrderGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OrderUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OrderUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OrderGetPayload<T>, Context>) => Promise<Prisma.OrderGetPayload<T>>
            };

    };
}
