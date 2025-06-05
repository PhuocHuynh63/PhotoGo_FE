import http from "@configs/fetch";

const attendanceService = {
    getAttendance: async (userId: string) => {
        return await http.get(`/attendance/history/${userId}`)
    },

    checkAttendance: async (userId: string) => {
        return await http.get(`/attendance/has-attendance/${userId}`)
    },

    checkIn: async (userId: string) => {
        return await http.post(`/attendance/check-in/${userId}`, {})
    }
}

export default attendanceService;
