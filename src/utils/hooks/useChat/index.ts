'use client';

import { useRef, useState, useEffect } from 'react';
import { getSocket, disconnectSocket } from '@configs/socket';
import { useChatSocket } from '../useChatSocket';
import { useChatConversations } from '../useChatConversations';

export const useChat = (userId: string, token?: string) => {
    const [socket, setSocket] = useState<any>(null);
    const { conversations, setConversations } = useChatConversations(userId);
    const [activeConversation, setActiveConversation] = useState<SOCKET.IConversation | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const activeRef = useRef(activeConversation);

    useEffect(() => {
        setSocket(getSocket(token || ''));
        return () => disconnectSocket();
    }, [token]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        activeRef.current = activeConversation;
    }, [activeConversation]);

    useChatSocket({
        socket,
        userId,
        onJoinChat: (chatId, messages) => {
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === chatId
                        ? { ...conv, messages, unreadCount: 0 }
                        : conv
                )
            );
            if (activeRef.current?.id === chatId) {
                setActiveConversation(prev =>
                    prev ? { ...prev, messages, unreadCount: 0 } : prev
                );
            }
        },
        onNewMessage: (message) => {
            setConversations(prev =>
                prev.map(conv => {
                    if (conv.id !== message.chatId) return conv;
                    const isActive = activeRef.current?.id === conv.id;
                    return {
                        ...conv,
                        messages: [...conv.messages, { ...message, read: isActive }],
                        lastMessage: { ...message, read: isActive },
                        unreadCount: isActive ? 0 : conv.unreadCount + 1,
                    };
                })
            );
            if (activeRef.current?.id === message.chatId) {
                setActiveConversation(prev =>
                    prev
                        ? {
                            ...prev,
                            messages: [...prev.messages, { ...message, read: true }],
                            lastMessage: { ...message, read: true },
                            unreadCount: 0,
                        }
                        : prev
                );
            }
        },
        onLeftRoom: (chatId) => {
            if (activeRef.current?.id === chatId) {
                setActiveConversation(null);
            }
        },
    });

    const handleSelectConversation = (conversation: SOCKET.IConversation) => {
        socket?.emit('joinChat', { memberId: conversation.member });

        setActiveConversation({
            ...conversation,
            messages: conversation.messages.map(m => ({ ...m, read: true })),
            unreadCount: 0,
        });

        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversation.id
                    ? {
                        ...conv,
                        messages: conv.messages.map(m => ({ ...m, read: true })),
                        unreadCount: 0,
                    }
                    : conv
            )
        );

        if (isMobile) setShowSidebar(false);
    };

    const handleSendMessage = (content: string) => {
        if (!socket || !activeConversation) return;
        socket.emit('sendMessage', {
            chatId: activeConversation.id,
            text: content,
            timestamp: new Date().toISOString(),
        });
    };

    const handleLeaveChat = () => {
        if (!socket || !activeConversation) return;
        socket.emit('leaveChat', { chatId: activeConversation.id });
    };

    const toggleSidebar = () => setShowSidebar(prev => !prev);

    return {
        isMobile,
        conversations,
        activeConversation,
        showSidebar,
        handleSelectConversation,
        handleSendMessage,
        handleLeaveChat,
        toggleSidebar,
    };
};
