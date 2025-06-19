import { ServiceTypeModel } from "@models/serviceTypes/common.model";
import { z } from "zod";

/**
 * Model of ServiceConcept
 */
export const ServiceConceptModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    price: z.string(),
    duration: z.number(),
    serviceTypes: z.array(ServiceTypeModel),
});

export type IServiceConcept = z.infer<typeof ServiceConceptModel>;
//----------------------End----------------------//


/**
 * Model of ServiceConceptImage
 */
export const ServiceConceptImageModel = z.object({
    id: z.string(),
    image_url: z.string(),
    service_concept_id: z.string(),
    created_at: z.string(),
});
export type IServiceConceptImageModel = z.infer<typeof ServiceConceptImageModel>;
//----------------------End----------------------//

/**
 * Model of ServiceConceptServiceType
 */
export const InvoiceServiceModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    images: z.array(z.object({
        id: z.string(),
        serviceConceptId: z.string(),
        imageUrl: z.string(),
        createdAt: z.string()
    })),
    price: z.string(),
    duration: z.number(),
    countConceptUsed: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    servicePackageId: z.string(),
    status: z.string(),
    serviceConceptServiceTypes: z.array(z.object({
        serviceConceptId: z.string(),
        serviceTypeId: z.string(),
        createdAt: z.string(),
        serviceType: ServiceTypeModel
    })),
});
export type IInvoiceServiceModel = z.infer<typeof InvoiceServiceModel>;
//----------------------End----------------------//