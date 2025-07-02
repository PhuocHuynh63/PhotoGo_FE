import http from "@configs/fetch";

interface BranchData {
    address: string;
    district: string;
    ward: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    name?: string;
    phone?: string;
    email?: string;
    manager?: string;
    isActive?: boolean;
    openingHours?: {
        weekdays: string;
        weekend: string;
    };
    facilities?: string[];
    services?: string[];
    monthlyRevenue?: number;
    totalBookings?: number;
}

const BranchService = {
    createBranch: async (vendorId: string, data: BranchData) => {
        return await http.post(`/locations/${vendorId}`, data, {
            next: { revalidate: 10 }
        })
    },

    updateBranch: async (locationId: string, data: BranchData) => {
        return await http.put(`/locations/${locationId}`, data, {
            next: { revalidate: 10 }
        })
    },

    deleteBranch: async (locationId: string) => {
        return await http.delete(`/locations/${locationId}`, {
            next: { revalidate: 10 }
        })
    },

}

export default BranchService;
