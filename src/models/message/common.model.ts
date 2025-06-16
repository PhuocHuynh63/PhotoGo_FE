import { z } from "zod";

/**
 * Model of Role
 */
export const MessageModel = z.object({
    id: z.string(),
    text: z.string(),
    timestamp: z.string(),
    isRead: z.boolean(),
    senderId: z.string(),
    chatId: z.string(),
})
export type IMessageModel = z.TypeOf<typeof MessageModel>
//----------------------End----------------------//