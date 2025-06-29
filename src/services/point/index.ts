import http from "@configs/fetch";

const pointService = {
    getPoint: async () => {
        const response = await http.get("/points/me");
        return response;
    },
    getPointTransaction: async () => {
        const response = await http.get("/points/me/transactions");
        return response;
    }
}

export default pointService;


