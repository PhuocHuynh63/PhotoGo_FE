import http from "@configs/fetch";

const geminiService = {
    chatbotGemini: async (data: any) => {
        return await http.post('/gemini/analyze', data)
    }
}

export default geminiService;