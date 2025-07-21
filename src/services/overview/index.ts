import http from "@configs/fetch";
import { IVendorOverviewRequest } from "@models/overview/request.model";

const overviewService = {

    getVendorOverview: async (params: IVendorOverviewRequest) => {
        IVendorOverviewRequest.parse(params);
        const { locationId, startDate, endDate, type } = params;
        return await http.get(`/overview/statistics?locationId=${locationId}&startDate=${startDate}&endDate=${endDate}&type=${type}`)
    },

}

export default overviewService