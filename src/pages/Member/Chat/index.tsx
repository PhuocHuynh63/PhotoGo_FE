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

    // ✨ [SỬA LỖI] Chỉ tìm nạp tin nhắn khi activeConversationId thay đổi
    // Và quản lý trạng thái 'conversation' dựa trên điều này.
    const { message: fetchedMessages, mutate: refetchMessages } = useMessageByChatId({
        chatId: activeConversationId,
        page: 1,
        pageSize: 15,
    });

    // ✨ [SỬA LỖI] Khởi tạo conversation khi activeConversationId thay đổi hoặc fetchedMessages cập nhật cho chat *mới*.
    // useEffect này giờ đây sẽ chỉ thiết lập 'conversation' khi 'fetchedMessages' thực sự được cập nhật cho một chat đang hoạt động mới,
    // hoặc khi component được mount với một chatId ban đầu.
    useEffect(() => {
        if (activeConversationId) {
            // Khi activeConversationId thay đổi, đặt lại conversation và để useMessageByChatId điền vào.
            // Điều này ngăn các tin nhắn cũ hiển thị trước khi tin nhắn mới được tìm nạp.
            setConversation([]);
            // Các fetchedMessages sau đó sẽ cập nhật trạng thái này.
            if (fetchedMessages?.length) {
                setConversation(fetchedMessages);
            }
        }
    }, [fetchedMessages, activeConversationId]); // Phụ thuộc vào cả hai để đảm bảo đặt lại rồi điền vào

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        socketInstance.on('newMessage', (newMessageData) => {
            const { chatId: messageChatId, text, senderId } = newMessageData;

            // Cập nhật danh sách các cuộc trò chuyện với tin nhắn cuối cùng mới và số lượng tin nhắn chưa đọc
            setListChatOfUser(prevList =>
                prevList.map(conv => {
                    if (conv.id === messageChatId) {
                        const isActive = activeConversationRef.current?.id === messageChatId;
                        return {
                            ...conv,
                            lastMessageText: text,
                            // Chỉ tăng nếu không phải chat đang hoạt động hoặc không phải tin nhắn tự gửi
                            unreadCount: isActive && senderId !== userId ? 0 : (conv.unreadCount || 0) + (isActive ? 0 : 1),
                        };
                    }
                    return conv;
                })
            );

            // Nếu tin nhắn dành cho cuộc trò chuyện đang hoạt động hiện tại, hãy thêm nó vào
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
            // Nên ngắt kết nối socket khi component unmount
            socketInstance.disconnect();
        };
    }, [token, userId]); // Thêm userId vào dependencies vì nó được sử dụng trong logic unreadCount

    const handleSelectConversation = (conversationData: any) => {
        if (activeConversationId === conversationData.id) return;

        // Rời khỏi cuộc trò chuyện trước đó (nếu có) và tham gia cuộc trò chuyện mới
        if (socket && activeConversationId) { // Kiểm tra xem có cuộc trò chuyện đang hoạt động trước đó không
            socket.emit('leaveChat', { chatId: activeConversationId });
        }
        if (socket) {
            socket.emit('joinChat', { memberId: conversationData.member, chatId: conversationData.id }); // Truyền chatId tới joinChat nếu backend của bạn hỗ trợ
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
            // Cập nhật trạng thái cuộc trò chuyện một cách lạc quan cho người gửi
            setConversation(prev => [...prev, { ...messagePayload, read: false }]); // Đánh dấu là chưa đọc ban đầu
        }
    };

    const handleLeaveChat = () => {
        if (socket && activeConversation) {
            socket.emit('leaveChat', { chatId: activeConversation.id });
            // Tùy chọn xóa cuộc trò chuyện đang hoạt động trong UI
            setActiveConversationId('');
            setConversation([]);
            // Điều hướng hoặc hiển thị tin nhắn mặc định
            const newUrl = `${ROUTES.USER.CHAT.replace('/:id', '')}`; // Chuyển đến một tuyến chat chung
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    };

    const toggleSidebar = () => setShowSidebar(prev => !prev);

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