'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
    /**
     * Define variables
     */
    const param = useParams();
    const chatId = param?.id as string;

    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;
    //---------------------End---------------------//

    const [listChatOfUser, setListChatOfUser] = useState<any[]>([]);
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


    /**
     * State to manage messages for the active conversation
     * - messagesPage: Current page of messages being fetched
     * - hasMoreMessages: Flag to indicate if there are more messages to load
     * - fetchedMessages: Fetched messages for the active conversation
     */
    const [messagesPage, setMessagesPage] = useState<number>(1);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
    const { message: fetchedMessages, loadingMessageByChatId: messagesLoading, mutate: refetchMessages } = useMessageByChatId({
        chatId: activeConversationId,
        page: messagesPage,
        pageSize: 15,
    });
    //---------------------End---------------------//


    /**
     * When activeConversationId changes, reset messages and fetch new messages
     * This effect runs when:
     * 1. activeConversationId is set (either from URL or user selection)
     * 2. fetchedMessages changes (new messages fetched)
     * 3. messagesPage is reset to 1
     */
    const [conversation, setConversation] = useState<any[]>([]);

    useEffect(() => {
        if (activeConversationId) {
            setMessagesPage(1);
            setHasMoreMessages(true);
            setConversation([]);

            setListChatOfUser(prevConvs =>
                prevConvs.map(conv =>
                    conv.id === activeConversationId ? { ...conv, unreadCount: 0 } : conv
                )
            );
        }
    }, [activeConversationId]);
    //---------------------------------End---------------------------------//

    useEffect(() => {
        // Chỉ cập nhật khi fetchedMessages có giá trị và không đang load
        if (fetchedMessages !== undefined && !messagesLoading) {
            if (messagesPage === 1) {
                // Khi load trang đầu tiên, thay thế toàn bộ conversation
                setConversation(fetchedMessages);
            } else {
                // Khi load các trang tiếp theo, thêm tin nhắn vào đầu mảng hiện có
                setConversation(prev => {
                    const newMessages = fetchedMessages.filter(
                        (msg: any) => !prev.some((pMsg: any) => pMsg.id === msg.id)
                    );
                    return [...newMessages, ...prev];
                });
            }

            // Cập nhật trạng thái hasMoreMessages
            // Nếu số tin nhắn fetched ít hơn pageSize, có nghĩa là không còn tin nhắn nữa
            if (fetchedMessages.length < 15) { // Dùng pageSize đã cấu hình (15)
                setHasMoreMessages(false);
            } else {
                setHasMoreMessages(true);
            }
        }
    }, [fetchedMessages, messagesLoading, messagesPage]);

    /**
     * useEffect initializes the socket connection and sets up event listeners.
     * It also checks if the device is mobile and updates the state accordingly.
     */
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);

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
                setHasMoreMessages(true);
            }
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
    //---------------------------------End---------------------------------//


    /**
     * useEffect to auto-join the chat room when:
     * 1. Socket is initialized and ready.
     * 2. activeConversationId has a value (indicating a chat is selected or from URL).
     * 3. listChatOfUser has loaded data (important to find `partnerId`).
     * 4. `activeConversation` is found (to avoid `null` or `undefined` when accessing `.member`).
     */
    useEffect(() => {
        if (socket && activeConversationId && listChatOfUser.length > 0) {
            const currentChat = listChatOfUser.find(c => c.id === activeConversationId);

            if (currentChat && currentChat.member) {
                console.log(`FRONTEND LOG: Auto-joining chat room ${activeConversationId} with partner ${currentChat.member}`);
                socket.emit('joinChat', { memberId: currentChat.member, chatId: activeConversationId });
            } else {
                console.warn(`FRONTEND WARN: Chat data for ${activeConversationId} not found in listChatOfUser for auto-join, or partner ID is missing.`);
            }
        } else if (socket && activeConversationId && listChatOfUser.length === 0) {
            console.log("FRONTEND LOG: Waiting for listChatOfUser to load before auto-joining.");
        }
    }, [socket, activeConversationId, listChatOfUser]);
    //---------------------------------End---------------------------------//


    /**
     * Handle selecting a conversation
     * @param conversationData 
     * @returns 
     */
    const handleSelectConversation = (conversationData: any) => {
        if (activeConversationId === conversationData.id) return;

        setMessagesPage(1);
        setHasMoreMessages(true);

        // Rời khỏi cuộc trò chuyện trước đó (nếu có) và tham gia cuộc trò chuyện mới
        if (socket && activeConversationId) {
            socket.emit('leaveChat', { chatId: activeConversationId });
        }
        if (socket) {
            socket.emit('joinChat', { memberId: conversationData.member, chatId: conversationData.id });
        }

        setActiveConversationId(conversationData.id);

        // Logic reset unreadCount khi chọn chat thủ công (giữ nguyên)
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
    //---------------------End---------------------//


    /**
     * Handle sending a message
     * @param content 
     */
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
    //---------------------End---------------------//

    /**
     * Handle loading more messages
     * This function is called when the user scrolls to the bottom of the message list.
     */
    const handleLoadMoreMessages = useCallback(() => {
        if (!messagesLoading && hasMoreMessages) {
            setMessagesPage(prevPage => prevPage + 1);
        }
    }, [messagesLoading, hasMoreMessages]);
    //---------------------End---------------------//

    /**
     * Handle leaving a chat
     * This function is called when the user wants to leave a chat.
     */
    const handleLeaveChat = () => {
        if (socket && activeConversation) {
            socket.emit('leaveChat', { chatId: activeConversation.id });
            setActiveConversationId('');
            setConversation([]);
            const newUrl = `${ROUTES.USER.CHAT.replace('/:id', '')}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    };
    //---------------------End---------------------//


    const toggleSidebar = () => setShowSidebar(prev => !prev);

    /**
     * Combine active conversation with its messages
     * This is used to pass the full conversation data to the ContentChat component.
     */
    const fullActiveConversation = useMemo(() => {
        if (!activeConversation) return null;
        return { ...activeConversation, messages: conversation };
    }, [activeConversation, conversation]);
    //---------------------End---------------------//

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
                    onLoadMoreMessages={handleLoadMoreMessages}
                    hasMoreMessages={hasMoreMessages}
                    messagesLoading={messagesLoading}
                />
            </div>
        </div>
    );
}