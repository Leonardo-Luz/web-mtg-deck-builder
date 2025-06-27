import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
        };
        exp?: number;
        iat?: number;
    }

    interface User {
        id: string;
        username: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            username: string;
        };
        exp?: number;
        iat?: number;
    }
}

