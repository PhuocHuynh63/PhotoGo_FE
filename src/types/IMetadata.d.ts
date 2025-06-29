import { IRole } from "@models/role/common.model";

declare namespace METADATA {
    export interface ISession {
        user: {
            id: string;
            email: string;
            role: IRole
            cartId: string;
            wishlistId: string;
        },
        accessToken: string;
    }
}