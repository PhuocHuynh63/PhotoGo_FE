import http from "@configs/fetch"

const chatService = {
    getChatList: async (memberId: string) => {
        return await http.get(`/chats/member/${memberId}`)
    },
}

export default chatService