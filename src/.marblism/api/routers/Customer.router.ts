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

        createMany: procedure.input($Schema.CustomerInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.createMany(input as any))),

        create: procedure.input($Schema.CustomerInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.create(input as any))),

        deleteMany: procedure.input($Schema.CustomerInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.deleteMany(input as any))),

        delete: procedure.input($Schema.CustomerInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.delete(input as any))),

        findFirst: procedure.input($Schema.CustomerInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).customer.findFirst(input as any))),

        findMany: procedure.input($Schema.CustomerInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).customer.findMany(input as any))),

        findUnique: procedure.input($Schema.CustomerInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).customer.findUnique(input as any))),

        updateMany: procedure.input($Schema.CustomerInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.updateMany(input as any))),

        update: procedure.input($Schema.CustomerInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).customer.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.CustomerCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.CustomerCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.CustomerGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.CustomerGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CustomerGetPayload<T>, Context>) => Promise<Prisma.CustomerGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.CustomerDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.CustomerDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.CustomerGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.CustomerGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CustomerGetPayload<T>, Context>) => Promise<Prisma.CustomerGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.CustomerFindFirstArgs, TData = Prisma.CustomerGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.CustomerFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CustomerGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CustomerFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CustomerFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CustomerGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.CustomerGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.CustomerFindManyArgs, TData = Array<Prisma.CustomerGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.CustomerFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.CustomerGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CustomerFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CustomerFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.CustomerGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.CustomerGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.CustomerFindUniqueArgs, TData = Prisma.CustomerGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.CustomerFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.CustomerGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.CustomerFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.CustomerFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.CustomerGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.CustomerGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.CustomerUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.CustomerUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.CustomerUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.CustomerGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.CustomerGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.CustomerUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.CustomerUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.CustomerGetPayload<T>, Context>) => Promise<Prisma.CustomerGetPayload<T>>
            };

    };
}
