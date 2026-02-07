import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        strapiToken?: string;
        user: {
            id: string;
            fullName?: string;
            phoneNumber?: string;
            address?: string;
            avatar?: any;
        } & DefaultSession["user"];
    }

    interface User {
        strapiToken?: string;
        fullName?: string;
        phoneNumber?: string;
        address?: string;
        avatar?: any;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        strapiToken?: string;
        id?: string;
        fullName?: string;
        phoneNumber?: string;
        address?: string;
        avatar?: any;
    }
}
