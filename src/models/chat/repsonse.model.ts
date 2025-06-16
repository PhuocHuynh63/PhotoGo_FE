import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ChatModel } from "./common.model";
import { MessageModel } from "@models/message/common.model";

/**
 * Model of ChatDefault
 * This model represents the default structure of a chat response.
 */
export const ChatReponseDefaultModel = ChatModel;

const ChatResponseModel = BackendResponseModel(ChatReponseDefaultModel);
export type IChatResponseDefaultModel = z.infer<typeof ChatResponseModel>;
//----------------------End----------------------//

/**
 *  Model of ChatMessageDefaultResponseModel
 *  This model represents the default structure of a chat message response.
 */
export const ChatMessageDefaultResponseModel = MessageModel;
const ChatMessageResponseModel = BackendResponseModel(ChatMessageDefaultResponseModel);
export type IChatMessageDefaultResponseModel = z.infer<typeof ChatMessageResponseModel>;
//----------------------End----------------------//