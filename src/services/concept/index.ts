import http from "@configs/fetch"

const conceptService = {
    getAServiceConceptById: async (id: string) => {
        return await http.get(`/service-packages/service-concept/${id}`, {
            next: { tags: [`service-concept-${id}`] }
        });
    }
}

export default conceptService
