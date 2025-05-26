'use client';

import { useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket } from '@configs/socket';

interface SocketEvents {
    onJoinedRoom: (data: { chatId: string; messages: any[] }) => void;
    onNewMessage: (message: any) => void;
    onChatNotification: (data: { chatId: string; newMessage: any }) => void;
    onUserStatusUpdate: (data: { userId: string; status: 'online' | 'offline'; lastSeen?: string }) => void;
    onUserProfileUpdate: (data: { userId: string; name: string; avatar: string }) => void;
    onError: (data: { message: string }) => void;
    onLeftRoom: (data: { chatId: string }) => void;
}

export function useSocket(token: string, events: SocketEvents) {
    useEffect(() => {
        const socket: Socket = getSocket(token);

        socket.on('joinedRoom', events.onJoinedRoom);
        socket.on('newMessage', events.onNewMessage);
        socket.on('chatNotification', events.onChatNotification);
        socket.on('userStatusUpdate', events.onUserStatusUpdate);
        socket.on('userProfileUpdate', events.onUserProfileUpdate);
        socket.on('joinChatError', events.onError);
        socket.on('sendMessageError', events.onError);
        socket.on('leaveChatError', events.onError);
        socket.on('userProfileError', events.onError);
        socket.on('leftRoom', events.onLeftRoom);

        return () => {
            disconnectSocket();
        };
    }, [token, events]);

    const emitJoinChat = useCallback(
        (memberId: string) => getSocket(token).emit('joinChat', { memberId }),
        [token]
    );

    const emitSendMessage = useCallback(
        (chatId: string, text: string) =>
            getSocket(token).emit('sendMessage', {
                chatId,
                text,
                timestamp: new Date().toISOString(),
            }),
        [token]
    );

    const emitLeaveChat = useCallback(
        (chatId: string) => getSocket(token).emit('leaveChat', { chatId }),
        [token]
    );

    const emitUpdateUserProfile = useCallback(
        (name: string, avatar: string) =>
            getSocket(token).emit('updateUserProfile', { name, avatar }),
        [token]
    );

    return { emitJoinChat, emitSendMessage, emitLeaveChat, emitUpdateUserProfile };
}