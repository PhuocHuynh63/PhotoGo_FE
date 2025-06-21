'use client'

import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@configs/socket';
import userService from '@services/user';
import { useChatByUserId } from '@utils/hooks/useChat';
import { IUserResponse } from '@models/user/response.model';
import { IChatModel } from '@models/chat/common.model';
import { ROUTES } from '@routes';
import SidebarChat from '../../Left/Sidebar';
import { PAGES } from '../../../../../types/IPages';
import { useRouter } from 'next/navigation';

export default function ChatIndexPage(session: PAGES.IChatProps) {
    const router = useRouter();

    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;

    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [listChatOfUser, setListChatOfUser] = useState<any[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);

    const { chat } = useChatByUserId({
        userId: userId || '',
        page: 1,
        pageSize: 15,
    });

    useEffect(() => {
        if (!chat || chat.length === 0) {
            setListChatOfUser([]);
            return;
        }

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
                        return {
                            ...conv,
                            lastMessageText: text,
                            unreadCount: (conv.unreadCount || 0) + 1,
                        };
                    }
                    return conv;
                })
            );
        });

        socketInstance.on('joinChatError', ({ message }) => alert(`Lỗi tham gia chat: ${message}`));
        socketInstance.on('sendMessageError', ({ message }) => alert(`Lỗi gửi tin nhắn: ${message}`));
        socketInstance.on('leaveChatError', ({ message }) => alert(`Lỗi rời chat: ${message}`));

        return () => {
            window.removeEventListener('resize', checkIsMobile);
            socketInstance.off('newMessage');
            socketInstance.disconnect();
        };
    }, [token, userId]);

    const handleSelectConversation = (conversationData: any) => {
        const newUrl = `${ROUTES.USER.CHAT.replace(':id', conversationData.id)}`;
        router.push(newUrl);
    };

    return (
        <div className="flex w-full h-screen">
            {/* SidebarChat sẽ luôn hiển thị ở đây */}
            <SidebarChat
                onSelectActiveConversation={() => { }} // Không cần set activeConversationId ở đây
                listChatOfUser={listChatOfUser}
                activeConversation={''}
                onSelectConversation={handleSelectConversation}
                showSidebar={showSidebar}
                isMobile={isMobile}
            />
            {/* Phần nội dung chính */}
            <div className="flex-1 flex flex-col h-full">
                {/* Hiển thị thông báo "Chọn một cuộc trò chuyện" */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h2>
                        <p className="text-gray-500">Chọn một người bạn từ danh sách để bắt đầu trò chuyện</p>
                    </div>
                </div>
            </div>
        </div>
    );
}