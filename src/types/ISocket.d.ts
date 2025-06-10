declare namespace SOCKET {
    export interface IChatMessage {
        id: string;
        chatId: string;
        sender_id: string;
        text: string;
        read: boolean;
        timestamp: string;
    }
    export interface IConversation {
        id: string;
        member: string;
        user: any;
        messages: ChatMessage[];
        unreadCount: number;
        lastMessage: ChatMessage;
    }
}