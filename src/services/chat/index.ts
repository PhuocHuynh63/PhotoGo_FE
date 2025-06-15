import http from "@configs/fetch"

const chatService = {
    getChatList: async (memberId: string, page: number = 1, pageSize: number = 10) => {
        return await http.get(`/chats/${memberId}?page=${page}&pageSize=${pageSize}`)
    },
    getMessageChatById: async (chatId: string, page: number = 1, pageSize: number = 15) => {
        return await http.get(`/chats/${chatId}/messages?page=${page}&pageSize=${pageSize}`)
    },
}

export default chatService