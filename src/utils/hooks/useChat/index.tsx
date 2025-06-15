import chatService from '@services/chat';
import { useEffect, useState } from 'react'

/**
 *  Custom hook to fetch messages by chat ID
 *  @param {Object} params - Parameters for fetching messages
 *  @param {string} params.chatId - The ID of the chat to fetch messages for
 *   @param {number} [params.page] - The page number for pagination
 *  @param {number} [params.pageSize=15] - The number of messages per page, default is 15
 *  @returns {Object} - An object containing the messages data, loading state, and error message
 */
type MessageByChatIdParams = {
    chatId: string;
    page?: number;
    pageSize?: number;
}

export const useMessageByChatId = ({
    chatId,
    page,
    pageSize = 15,
}: MessageByChatIdParams) => {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        chatService.getMessageChatById(chatId, page, pageSize)
            .then((response: any) => {
                if (isMounted) {
                    setMessage(response.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch messages');
                    setLoading(false);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        }

    }, [chatId, page, pageSize]);

    return {
        message,
        loading,
        error,
    }
}
//--------------------------End--------------------------//


/**
 *  Custom hook to fetch chat list by user ID
 *  @param {Object} params - Parameters for fetching chat list
 *   @param {string} params.userId - The ID of the user to fetch chats for
 *   @param {number} [params.page] - The page number for pagination
 *   @param {number} [params.pageSize=15] - The number of chats per page, default is 15
 *  @returns {Object} - An object containing the chat list data, loading state, and error message
 */
type ChatByUserIdParams = {
    userId: string;
    page?: number;
    pageSize?: number;
}

export const useChatByUserId = ({
    userId,
    page,
    pageSize,
}: ChatByUserIdParams) => {
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        chatService.getChatList(userId, page, pageSize)
            .then((response: any) => {
                if (isMounted) {
                    setChat(response.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch chats');
                    setLoading(false);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        }

    }, []);

    return {
        chat,
        loading,
        error,
    }
}
//--------------------------End--------------------------//
