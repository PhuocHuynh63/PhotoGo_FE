'use client';

import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket } from '@configs/socket';
import chatService from '@services/chat';
import userService from '@services/user';
import { PAGES } from '../../../types/IPages';
import SidebarChat from './Left/Sidebar';
import ContentChat from './Right/Content';

export default function ChatPage(session: PAGES.IChatProps) {
    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;

    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [joinedRoom, setJoinedRoom] = useState(false);

    const activeConversationRef = useRef(activeConversation);
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        const fetchChats = async () => {
            try {
                const chats = await chatService.getChatList(userId) as { data: any[] };
                const convs: any[] = await Promise.all(
                    chats?.data?.map(async (chat: any) => {
                        const partnerId = chat.members.find((m: string) => m !== userId)!;
                        const user = await userService.getAUser(partnerId);
                        const unreadCount = chat.messages.filter((m: any) => m.sender_id !== userId && !m.read).length;
                        return {
                            id: chat.id,
                            user,
                            member: partnerId,
                            messages: chat.messages,
                            unreadCount,
                            lastMessage: chat.messages[chat.messages.length - 1],
                        };
                    })
                );
                setConversations(convs);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách chat:', error);
            }
        };
        fetchChats();

        socketInstance.on('joinChat', ({ chatId, messages }) => {
            setJoinedRoom(true);
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === chatId ? { ...conv, messages, unreadCount: 0 } : conv
                )
            );
            if (activeConversationRef.current?.id === chatId) {
                setActiveConversation((prev: any) => (prev ? { ...prev, messages, unreadCount: 0 } : prev));
            }
        });

        //TODO
        socketInstance.on('newMessage', (message) => {
            setConversations(prev =>
                prev.map(conv => {
                    if (conv.id === message.chatId) {
                        const isActive = activeConversationRef.current?.id === conv.id;
                        return {
                            ...conv,
                            messages: [...conv.messages, { ...message, read: isActive }],
                            lastMessage: { ...message, read: isActive },
                            unreadCount: isActive ? 0 : conv.unreadCount + 1,
                        };
                    }
                    return conv;
                })
            );

            if (activeConversationRef.current?.id === message.chatId) {
                setActiveConversation((prev: any) =>
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
        });

        socketInstance.on('leftRoom', ({ chatId }) => {
            if (activeConversationRef.current?.id === chatId) {
                setActiveConversation(null);
            }
        });

        socketInstance.on('joinChatError', ({ message }) => alert(`Lỗi tham gia chat: ${message}`));
        socketInstance.on('sendMessageError', ({ message }) => alert(`Lỗi gửi tin nhắn: ${message}`));
        socketInstance.on('leaveChatError', ({ message }) => alert(`Lỗi rời chat: ${message}`));

        return () => {
            window.removeEventListener('resize', checkIsMobile);
            disconnectSocket();
        };
    }, [token, userId]);

    const handleSelectConversation = (conversation: any) => {
        if (socket) {
            socket.emit('joinChat', { memberId: conversation.member });
        }
        setActiveConversation({
            ...conversation,
            messages: conversation.messages.map((m: any) => ({ ...m, read: true })),
            unreadCount: 0,
        });

        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversation.id
                    ? {
                        ...conv,
                        messages: conv.messages.map((m: any) => ({ ...m, read: true })),
                        unreadCount: 0,
                    }
                    : conv
            )
        );

        if (isMobile) {
            setShowSidebar(false);
        }
    };

    const handleSendMessage = (content: string) => {
        if (socket && activeConversation) {
            socket.emit('sendMessage', {
                chatId: activeConversation.id,
                text: content,
                timestamp: new Date().toISOString(),
            });
        }
    };

    const handleLeaveChat = () => {
        if (socket && activeConversation) {
            socket.emit('leaveChat', { chatId: activeConversation.id });
        }
    };

    const toggleSidebar = () => setShowSidebar(prev => !prev);

    return (
        <div className="flex w-full h-screen">
            <SidebarChat
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
                showSidebar={showSidebar}
                isMobile={isMobile}
            />
            <div className="flex-1 flex flex-col h-full">
                <ContentChat
                    activeConversation={activeConversation}
                    onSendMessage={handleSendMessage}
                    onLeaveChat={handleLeaveChat}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                    userId={userId}
                />
            </div>
        </div>
    );
}
