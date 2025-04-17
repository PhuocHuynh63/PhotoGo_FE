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
        },
        accessToken: string;
    }
}