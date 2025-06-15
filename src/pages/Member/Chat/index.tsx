'use client';

import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket } from '@configs/socket';
import chatService from '@services/chat';
import userService from '@services/user';
import { PAGES } from '../../../types/IPages';
import SidebarChat from './Left/Sidebar';
import ContentChat from './Right/Content';
import { useParams, useRouter } from 'next/navigation';
import { useChatByUserId, useMessageByChatId } from '@utils/hooks/useChat';
import { IUserResponse } from '@models/user/response.model';

export default function ChatPage(session: PAGES.IChatProps) {
    /**
     * Define from URL
     * Get chat ID from URL parameters
     */
    const param = useParams();
    const router = useRouter();
    const chatId = param?.id as string;
    //---------------------End---------------------//

    /**
     * Get user ID and token from session
     */
    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;
    //---------------------End---------------------//

    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeConversationId, setActiveConversationId] = useState<string>(chatId || '');

    const activeConversationRef = useRef(activeConversation);
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    /**
     *  Fetch chat list by user ID
     */
    const { chat } = useChatByUserId({
        userId: userId || '',
        page: 1,
        pageSize: 15,
    });

    useEffect(() => {
        if (!chat || chat.length === 0) return;

        const format = async () => {
            const convs = await Promise.all(
                chat?.map(async (chat: any) => {
                    const partnerId = chat.members.find((m: string) => m !== userId);
                    if (!partnerId) return null;
                    const user = await userService.getAUser(partnerId) as IUserResponse;
                    return {
                        id: chat.id,
                        user: user.data,
                        member: partnerId,
                        lastMessageText: chat.lastMessageText,
                        unreadCount: chat.unreadCount,
                    };
                })
            );
            setConversations(convs);
        };

        format();
    }, [chat, userId]);
    //---------------------End---------------------//

    const { message } = useMessageByChatId({
        chatId: activeConversationId,
        page: 1,
        pageSize: 15,
    });
    console.log('messages', message);



    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        socketInstance.on('joinChat', ({ chatId, messages }) => {
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === chatId ? { ...conv, messages, unreadCount: 0 } : conv
                )
            );
            if (activeConversationRef.current?.id === chatId) {
                setActiveConversation((prev: any) => (prev ? { ...prev, messages, unreadCount: 0 } : prev));
            }
        });

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
        };
    }, [token, userId]);

    const handleSelectConversation = (conversation: any) => {
        if (socket) {
            socket.emit('joinChat', { memberId: conversation.member });
        }
        setActiveConversation({
            ...conversation,
            unreadCount: 0,
        });

        setConversations(prevConvs =>
            prevConvs.map(conv =>
                conv.id === conversation.id
                    ? { ...conv, unreadCount: 0 }
                    : conv
            )
        );
        if (isMobile) {
            setShowSidebar(false);
        }

        router.push(`/chat/${conversation.id}`);
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
                activeConversation={activeConversationId}
                onSelectActiveConversation={setActiveConversationId}
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
