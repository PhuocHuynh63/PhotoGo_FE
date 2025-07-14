import http from "@configs/fetch"

const conceptService = {
    getAServiceConceptById: async (id: string, showAll: boolean = false) => {
        return await http.get(`/service-packages/service-concept/${id}?showAll=${showAll}`, {
            next: { tags: [`service-concept-${id}`] }
        });
    }
}

export default conceptService
