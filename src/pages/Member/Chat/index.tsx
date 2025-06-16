'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@configs/socket';
import userService from '@services/user';
import { PAGES } from '../../../types/IPages';
import SidebarChat from './Left/Sidebar';
import ContentChat from './Right/Content';
import { useParams } from 'next/navigation';
import { useChatByUserId, useMessageByChatId } from '@utils/hooks/useChat';
import { IUserResponse } from '@models/user/response.model';
import { ROUTES } from '@routes';
import { IChatModel } from '@models/chat/common.model';

export default function ChatPage(session: PAGES.IChatProps) {
    const param = useParams();
    const chatId = param?.id as string;

    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;

    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [listChatOfUser, setListChatOfUser] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);

    // ✨ [REFACTOR] Suy luận `activeConversation` từ `activeConversationId` và `listChatOfUser`.
    // Cách này giúp state luôn nhất quán và tránh được lỗi giao diện nhấp nháy.
    const [activeConversationId, setActiveConversationId] = useState<string>(chatId || '');
    const activeConversation = useMemo(() => {
        if (!activeConversationId || !listChatOfUser.length) return null;
        return listChatOfUser.find(c => c.id === activeConversationId);
    }, [activeConversationId, listChatOfUser]);

    const activeConversationRef = useRef(activeConversation);
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    const { chat } = useChatByUserId({
        userId: userId || '',
        page: 1,
        pageSize: 15,
    });

    useEffect(() => {
        if (!chat || chat.length === 0) return;

        const formatConversations = async () => {
            const convs = await Promise.all(
                chat.map(async (chatItem: IChatModel) => {
                    const partnerId = chatItem.members.find((m: string) => m !== userId);
                    if (!partnerId) return null;
                    const user = (await userService.getAUser(partnerId)) as IUserResponse;
                    return {
                        id: chatItem.id,
                        user: user.data,
                        member: partnerId,
                        lastMessageText: chatItem.lastMessageText,
                        unreadCount: chatItem.unreadCount,
                    };
                })
            );
            const validConvs = convs.filter(c => c !== null);
            setListChatOfUser(validConvs);
        };

        formatConversations();
    }, [chat, userId]);

    const { message: fetchedMessages } = useMessageByChatId({
        chatId: activeConversationId,
        page: 1,
        pageSize: 15,
    });

    useEffect(() => {
        if (fetchedMessages?.length) {
            setConversation([...fetchedMessages].reverse());
        } else {
            // Đảm bảo `conversation` được reset khi không có tin nhắn (ví dụ: chat mới)
            setConversation([]);
        }
    }, [fetchedMessages]);

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        socketInstance.on('newMessage', (newMessageData) => {
            const { chatId: messageChatId, text } = newMessageData;

            setListChatOfUser(prevList =>
                prevList.map(conv => {
                    if (conv.id === messageChatId) {
                        const isActive = activeConversationRef.current?.id === messageChatId;
                        return {
                            ...conv,
                            lastMessageText: text,
                            unreadCount: isActive ? 0 : (conv.unreadCount || 0) + 1,
                        };
                    }
                    return conv;
                })
            );

            if (activeConversationRef.current?.id === messageChatId) {
                setConversation(prev => [...prev, { ...newMessageData, read: true }]);
            }
        });

        socketInstance.on('joinChatError', ({ message }) => alert(`Lỗi tham gia chat: ${message}`));
        socketInstance.on('sendMessageError', ({ message }) => alert(`Lỗi gửi tin nhắn: ${message}`));
        socketInstance.on('leaveChatError', ({ message }) => alert(`Lỗi rời chat: ${message}`));

        return () => {
            window.removeEventListener('resize', checkIsMobile);
            socketInstance.off('newMessage');
        };
    }, [token]);

    // ✨ [REFACTOR] Hàm xử lý giờ chỉ cần cập nhật ID
    const handleSelectConversation = (conversationData: any) => {
        if (activeConversationId === conversationData.id) return;

        if (socket) {
            socket.emit('joinChat', { memberId: conversationData.member });
        }

        setActiveConversationId(conversationData.id);

        setListChatOfUser(prevConvs =>
            prevConvs.map(conv =>
                conv.id === conversationData.id ? { ...conv, unreadCount: 0 } : conv
            )
        );

        if (isMobile) {
            setShowSidebar(false);
        }

        const newUrl = `${ROUTES.USER.CHAT.replace(':id', conversationData.id)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    const handleSendMessage = (content: string) => {
        if (socket && activeConversation) {
            const messagePayload = {
                chatId: activeConversation.id,
                senderId: userId,
                text: content,
                timestamp: new Date().toISOString(),
            };
            socket.emit('sendMessage', messagePayload);
        }
    };

    const handleLeaveChat = () => {
        if (socket && activeConversation) {
            socket.emit('leaveChat', { chatId: activeConversation.id });
        }
    };

    const toggleSidebar = () => setShowSidebar(prev => !prev);

    // ✨ [REFACTOR] Kết hợp `activeConversation` và `conversation` trước khi truyền xuống ContentChat
    const fullActiveConversation = useMemo(() => {
        if (!activeConversation) return null;
        return { ...activeConversation, messages: conversation };
    }, [activeConversation, conversation]);

    return (
        <div className="flex w-full h-screen">
            <SidebarChat
                onSelectActiveConversation={setActiveConversationId}
                listChatOfUser={listChatOfUser}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
                showSidebar={showSidebar}
                isMobile={isMobile}
            />
            <div className="flex-1 flex flex-col h-full">
                <ContentChat
                    activeConversation={fullActiveConversation}
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
