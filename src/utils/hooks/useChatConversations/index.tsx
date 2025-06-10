'use client';

import { useState, useEffect } from 'react';
import chatService from '@services/chat';
import userService from '@services/user';

export const useChatConversations = (userId: string) => {
    const [conversations, setConversations] = useState<SOCKET.IConversation[]>([]);

    const fetchConversations = async () => {
        const chats = await chatService.getChatList(userId) as { data: any[] };

        const formatted: SOCKET.IConversation[] = await Promise.all(
            chats?.data?.map(async (chat: any) => {
                const partnerId = chat.members.find((m: string) => m !== userId);
                const user = await userService.getAUser(partnerId);
                const unreadCount = chat.messages.filter(
                    (m: any) => m.sender_id !== userId && !m.read
                ).length;

                return {
                    id: chat.id,
                    user,
                    member: partnerId,
                    messages: chat.messages,
                    unreadCount,
                    lastMessage: chat.messages.at(-1),
                };
            })
        );

        setConversations(formatted);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return { conversations, setConversations };
};
