declare namespace METADATA {
    export interface ISession {
        user: {
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