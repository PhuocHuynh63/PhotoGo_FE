import http from "@configs/fetch";

const attendanceService = {
    getAttendance: async (userId: string) => {
        return await http.get(`/attendance/history/${userId}`, {
            cache: "no-store"
        })
    },

    checkAttendance: async (userId: string) => {
        return await http.get(`/attendance/has-attendance/${userId}`, {
            cache: "no-store"
        })
    },

    checkIn: async (userId: string) => {
        return await http.post(`/attendance/check-in/${userId}`, {})
    }
}

export default attendanceService;
