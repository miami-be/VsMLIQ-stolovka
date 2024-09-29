/* eslint-disable */
import type { unsetMarker, AnyRouter, AnyRootConfig, CreateRouterInner, Procedure, ProcedureBuilder, ProcedureParams, ProcedureRouterRecord, ProcedureType } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import createMealRouter from "./Meal.router";
import createMealTagRouter from "./MealTag.router";
import createCustomerRouter from "./Customer.router";
import createOrderRouter from "./Order.router";
import createOrderItemRouter from "./OrderItem.router";
import createUserRouter from "./User.router";
import createAccountRouter from "./Account.router";
import createSessionRouter from "./Session.router";
import { ClientType as MealClientType } from "./Meal.router";
import { ClientType as MealTagClientType } from "./MealTag.router";
import { ClientType as CustomerClientType } from "./Customer.router";
import { ClientType as OrderClientType } from "./Order.router";
import { ClientType as OrderItemClientType } from "./OrderItem.router";
import { ClientType as UserClientType } from "./User.router";
import { ClientType as AccountClientType } from "./Account.router";
import { ClientType as SessionClientType } from "./Session.router";

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = <
    ProcRouterRecord extends ProcedureRouterRecord
>(
    procedures: ProcRouterRecord
) => CreateRouterInner<Config, ProcRouterRecord>;

export type UnsetMarker = typeof unsetMarker;

export type ProcBuilder<Config extends BaseConfig> = ProcedureBuilder<
    ProcedureParams<Config, any, any, any, UnsetMarker, UnsetMarker, any>
>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({
        meal: createMealRouter(router, procedure),
        mealTag: createMealTagRouter(router, procedure),
        customer: createCustomerRouter(router, procedure),
        order: createOrderRouter(router, procedure),
        orderItem: createOrderItemRouter(router, procedure),
        user: createUserRouter(router, procedure),
        account: createAccountRouter(router, procedure),
        session: createSessionRouter(router, procedure),
    }
    );
}

export interface ClientType<AppRouter extends AnyRouter> {
    meal: MealClientType<AppRouter>;
    mealTag: MealTagClientType<AppRouter>;
    customer: CustomerClientType<AppRouter>;
    order: OrderClientType<AppRouter>;
    orderItem: OrderItemClientType<AppRouter>;
    user: UserClientType<AppRouter>;
    account: AccountClientType<AppRouter>;
    session: SessionClientType<AppRouter>;
}
