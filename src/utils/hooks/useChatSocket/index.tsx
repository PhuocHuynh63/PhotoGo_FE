'use client';

import { useEffect } from 'react';
import { Socket } from 'socket.io-client';


interface Props {
    socket: Socket | null;
    userId: string;
    onJoinChat: (chatId: string, messages: SOCKET.IChatMessage[]) => void;
    onNewMessage: (message: SOCKET.IChatMessage) => void;
    onLeftRoom: (chatId: string) => void;
}

export const useChatSocket = ({
    socket,
    userId,
    onJoinChat,
    onNewMessage,
    onLeftRoom,
}: Props) => {
    useEffect(() => {
        console.log('Trạng thái socket trong useChatSocket:', socket);

        if (!socket) return;

        socket.on('joinedRoom', (data) => {
            console.log('Server phản hồi "joinedRoom":', data);
            onJoinChat(data.chatId, data.messages);
        });

        socket.on('newMessage', (message) => {
            onNewMessage(message);
        });

        socket.on('leftRoom', ({ chatId }) => {
            onLeftRoom(chatId);
        });

        socket.on('joinChatError', ({ message }) => alert(`Lỗi tham gia chat: ${message}`));
        socket.on('sendMessageError', ({ message }) => alert(`Lỗi gửi tin nhắn: ${message}`));
        socket.on('leaveChatError', ({ message }) => alert(`Lỗi rời chat: ${message}`));

        return () => {
            socket.off('joinChat');
            socket.off('newMessage');
            socket.off('leftRoom');
        };
    }, [socket]);
};
