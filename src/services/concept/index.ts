import http from "@configs/fetch"

const ConceptService = {
    getAServiceConceptById: async (id: string) => {
        return await http.get(`/service-packages/service-concept/${id}`, {
            next: { tags: [`service-concept-${id}`] }
        });
    }
}

export default ConceptService
