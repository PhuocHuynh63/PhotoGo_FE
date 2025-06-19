import { useEffect, useState } from "react";
import ConceptService from "@services/concept";
import { InvoiceServiceModel } from "@models/serviceConcepts/common.model";
import type { IInvoiceServiceModel } from "@models/serviceConcepts/common.model";
import { IServiceConceptResponseModel } from "@models/serviceConcepts/response.model";


export function useConcept(conceptId: string | undefined) {
    const [concept, setConcept] = useState<IInvoiceServiceModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!conceptId) {
            setConcept(null);
            return;
        }

        const fetchConcept = async () => {
            try {
                setLoading(true);
                const response = await ConceptService.getAServiceConceptById(conceptId) as IServiceConceptResponseModel;
                if (response?.data) {
                    // Parse the data through the Zod schema to ensure it matches the expected type
                    const parsedData = InvoiceServiceModel.parse(response.data);
                    setConcept(parsedData);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch concept'));
            } finally {
                setLoading(false);
            }
        };

        fetchConcept();
    }, [conceptId]);

    return { concept, loading, error };
}