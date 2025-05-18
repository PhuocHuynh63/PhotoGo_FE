import { z } from "zod";

/**
 * Model of Role
 */
export const ChatModel = z.object({
    id: z.string(),
    members: z.array(z.any()),
    messages: z.array(z.any()),
    last_updated: z.string(),
})
export type IChat = z.TypeOf<typeof ChatModel>
//----------------------End----------------------//