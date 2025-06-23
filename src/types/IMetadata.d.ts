declare namespace METADATA {
    export interface ISession {
        user: {
            id: string;
            email: string;
            role: {
                id: string;
                name: string;
                description: string;
            }
            cartId: string;
            wishlistId: string;
        },
        accessToken: string;
    }
}