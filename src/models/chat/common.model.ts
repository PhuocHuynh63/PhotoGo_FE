import { z } from "zod";

/**
 * Model of Role
 */
export const ChatModel = z.object({
    id: z.string(),
    members: z.array(z.string()),
    lastMessageText: z.string().nullable(),
    createdAt: z.string(),
    lastUpdatedAt: z.string(),
    unreadCount: z.number().default(0),
})
export type IChatModel = z.TypeOf<typeof ChatModel>
//----------------------End----------------------//