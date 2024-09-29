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

        createMany: procedure.input($Schema.MealTagInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.createMany(input as any))),

        create: procedure.input($Schema.MealTagInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.create(input as any))),

        deleteMany: procedure.input($Schema.MealTagInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.deleteMany(input as any))),

        delete: procedure.input($Schema.MealTagInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.delete(input as any))),

        findFirst: procedure.input($Schema.MealTagInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).mealTag.findFirst(input as any))),

        findMany: procedure.input($Schema.MealTagInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).mealTag.findMany(input as any))),

        findUnique: procedure.input($Schema.MealTagInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).mealTag.findUnique(input as any))),

        updateMany: procedure.input($Schema.MealTagInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.updateMany(input as any))),

        update: procedure.input($Schema.MealTagInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).mealTag.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.MealTagCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.MealTagCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealTagGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealTagGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealTagGetPayload<T>, Context>) => Promise<Prisma.MealTagGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.MealTagDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.MealTagDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealTagGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealTagGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealTagGetPayload<T>, Context>) => Promise<Prisma.MealTagGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.MealTagFindFirstArgs, TData = Prisma.MealTagGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.MealTagFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MealTagGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealTagFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealTagFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MealTagGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MealTagGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.MealTagFindManyArgs, TData = Array<Prisma.MealTagGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.MealTagFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.MealTagGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealTagFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealTagFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.MealTagGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.MealTagGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.MealTagFindUniqueArgs, TData = Prisma.MealTagGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.MealTagFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MealTagGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealTagFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealTagFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MealTagGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MealTagGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.MealTagUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.MealTagUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealTagUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealTagGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealTagGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealTagUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealTagUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealTagGetPayload<T>, Context>) => Promise<Prisma.MealTagGetPayload<T>>
            };

    };
}
