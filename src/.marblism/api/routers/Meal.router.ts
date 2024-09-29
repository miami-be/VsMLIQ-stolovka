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

        createMany: procedure.input($Schema.MealInputSchema.createMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.createMany(input as any))),

        create: procedure.input($Schema.MealInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.create(input as any))),

        deleteMany: procedure.input($Schema.MealInputSchema.deleteMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.deleteMany(input as any))),

        delete: procedure.input($Schema.MealInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.delete(input as any))),

        findFirst: procedure.input($Schema.MealInputSchema.findFirst).query(({ ctx, input }) => checkRead(db(ctx).meal.findFirst(input as any))),

        findMany: procedure.input($Schema.MealInputSchema.findMany).query(({ ctx, input }) => checkRead(db(ctx).meal.findMany(input as any))),

        findUnique: procedure.input($Schema.MealInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).meal.findUnique(input as any))),

        updateMany: procedure.input($Schema.MealInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.updateMany(input as any))),

        update: procedure.input($Schema.MealInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).meal.update(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.MealCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.MealCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealGetPayload<T>, Context>) => Promise<Prisma.MealGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.MealDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.MealDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealGetPayload<T>, Context>) => Promise<Prisma.MealGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.MealFindFirstArgs, TData = Prisma.MealGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.MealFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MealGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealFindFirstArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MealGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MealGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.MealFindManyArgs, TData = Array<Prisma.MealGetPayload<T>>>(
            input: Prisma.SelectSubset<T, Prisma.MealFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.MealGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealFindManyArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.MealGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.MealGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.MealFindUniqueArgs, TData = Prisma.MealGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.MealFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.MealGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.MealFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.MealFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.MealGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.MealGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.MealUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.MealUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.MealUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.MealGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.MealGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.MealUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.MealUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.MealGetPayload<T>, Context>) => Promise<Prisma.MealGetPayload<T>>
            };

    };
}
