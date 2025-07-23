import { z } from "zod";
import { SubscriptionModel } from "./common.model";
import { PaginationModel } from "@models/metadata";
import { SubscriptionPlanModel } from "@models/subcription_plan/common.model";

const MetadataModel = z.object({
        action: z.string(),
        amount: z.string(),
        planId: z.string(),
        status: z.string(),
        userId: z.string(),
        endDate: z.string(),
        planName: z.string(),
        invoiceId: z.string(),
        payerType: z.string(),
        paymentId: z.string(),
        planPrice: z.string(),
        startDate: z.string(),
        timestamp: z.string(),
        billingCycle: z.string(),
        planDuration: z.number(),
        assignedUserId: z.string(),
        isFirstPayment: z.boolean(),
        subscriptionId: z.string(),
});

const SubscriptionHistoryDetailModel = z.object({
        id: z.string(),
        subscriptionId: z.string(),
        action: z.string(),
        description: z.string(),
        metadata: MetadataModel,
        payerType: z.string(),
        createdAt: z.string(),
});

export const SubscriptionHistoryModel = z.object({
        plan: SubscriptionPlanModel,
        subscription: SubscriptionModel,
        historyDetails: z.array(SubscriptionHistoryDetailModel),
        payment: z.string(),
});
export type ISubscriptionHistoryModel = z.infer<typeof SubscriptionHistoryModel>;

export const SubscriptionHistoryResponseModel = z.object({
        statusCode: z.number(),
        message: z.string(),
        history: z.array(SubscriptionHistoryModel),
        pagination: PaginationModel
});

export type ISubscriptionHistoryResponseModel = z.infer<typeof SubscriptionHistoryResponseModel>;
//----------------------End----------------------//