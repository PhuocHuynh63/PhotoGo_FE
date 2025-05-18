'use client';

import { useState, useEffect } from 'react';
import { SidebarChat } from './Left/Sidebar';
import { ContentChat } from './Right/Content';
import { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket } from '@configs/socket';
import chatService from '@services/chat';
import userService from '@services/user';

export default function ChatPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);

    const userId = '13acb33d-c1d1-4f32-92e5-4ddf416b9c48';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0dWRpbzk5QGV4YW1wbGUuY29tIiwic3ViIjoiMTNhY2IzM2QtYzFkMS00ZjMyLTkyZTUtNGRkZjQxNmI5YzQ4Iiwicm9sZSI6eyJpZCI6IlIwMDQiLCJuYW1lIjoic3R1ZGlvIiwiZGVzY3JpcHRpb24iOiLEkOG7i2EgxJFp4buDbSBjaG8gdGh1w6ogxJHhu4MgY2jhu6VwIOG6o25oIn0sImlhdCI6MTc0NzUzOTIxMiwiZXhwIjoxNzQ3NjI1NjEyfQ.8VHk-ZeCuhmZcXW9hHgoPWC27QXYcDTOeu5RHgnc1es';

    useEffect(() => {
        // Responsive check
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        // Khởi tạo socket
        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        // Lấy danh sách chats
        const fetchChats = async () => {
            try {
                const chats = await chatService.getChatList(userId) as { data: any[] };
                console.log('chats', chats);
                const convs: any[] = await Promise.all(
                    chats.data.map(async (chat: any) => {
                        const partnerId = chat.members.find((m: any) => m !== userId)!;
                        const user = await userService.getAUser(partnerId);
                        const unreadCount = chat.messages.filter((m: any) => m.sender_id !== userId && !m.read).length;
                        return {
                            id: chat.id,
                            user,
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

        // WebSocket events
        socketInstance.on('joinedRoom', ({ chatId, messages }: { chatId: string; messages: any[] }) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === chatId ? { ...conv, messages, unreadCount: 0 } : conv
                )
            );
            if (activeConversation?.id === chatId) {
                setActiveConversation((prev: any) => (prev ? { ...prev, messages, unreadCount: 0 } : prev));
            }
        });

        socketInstance.on('newMessage', (message: any) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === activeConversation?.id
                        ? {
                            ...conv,
                            messages: [...conv.messages, { ...message, read: true }],
                            lastMessage: { ...message, read: true },
                            unreadCount: 0,
                        }
                        : conv
                )
            );
            if (activeConversation?.id === activeConversation.id) {
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

        socketInstance.on('chatNotification', ({ chatId, newMessage }: { chatId: string; newMessage: any }) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === chatId
                        ? {
                            ...conv,
                            messages: [...conv.messages, newMessage],
                            lastMessage: newMessage,
                            unreadCount: conv.id === activeConversation?.id ? 0 : conv.unreadCount + 1,
                        }
                        : conv
                )
            );
            if (activeConversation?.id === chatId) {
                setActiveConversation((prev: any) =>
                    prev
                        ? {
                            ...prev,
                            messages: [...prev.messages, { ...newMessage, read: true }],
                            lastMessage: { ...newMessage, read: true },
                            unreadCount: 0,
                        }
                        : prev
                );
            }
        });

        socketInstance.on('joinChatError', ({ message }: { message: string }) => {
            alert(`Lỗi tham gia chat: ${message}`);
        });

        socketInstance.on('sendMessageError', ({ message }: { message: string }) => {
            alert(`Lỗi gửi tin nhắn: ${message}`);
        });

        socketInstance.on('leaveChatError', ({ message }: { message: string }) => {
            alert(`Lỗi rời chat: ${message}`);
        });

        socketInstance.on('leftRoom', ({ chatId }: { chatId: string }) => {
            if (activeConversation?.id === chatId) {
                setActiveConversation(null);
            }
        });

        return () => {
            window.removeEventListener('resize', checkIsMobile);
            disconnectSocket();
        };
    }, [activeConversation, userId, token]);

    const handleSelectConversation = (conversation: any) => {
        if (socket) {
            socket.emit('joinChat', { memberId: conversation.user.id });
        }
        setActiveConversation({
            ...conversation,
            messages: conversation.messages.map((m: any) => ({ ...m, read: true })),
            unreadCount: 0,
        });
        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === conversation.id
                    ? { ...conv, messages: conv.messages.map((m: any) => ({ ...m, read: true })), unreadCount: 0 }
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

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

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
                />
            </div>
        </div>
    );
}