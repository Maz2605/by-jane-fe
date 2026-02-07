import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Define User type that matches Strapi response
interface StrapiUser {
    id: number;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    avatar?: any;
    createdAt?: string;
    updatedAt?: string;
}

interface StrapiAuthResponse {
    jwt: string;
    user: StrapiUser;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const API_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337').replace(/\/$/, '');

                    const res = await fetch(`${API_URL}/api/auth/local`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            identifier: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        return null;
                    }

                    const data: StrapiAuthResponse = await res.json();

                    if (data.jwt && data.user) {
                        // 🔥 FIX: Fetch full user profile (bao gồm Avatar) ngay khi login
                        try {
                            const meRes = await fetch(`${API_URL}/api/users/me?populate=*`, {
                                headers: {
                                    Authorization: `Bearer ${data.jwt}`,
                                },
                            });

                            if (meRes.ok) {
                                const fullUser = await meRes.json();
                                // Merge data: ưu tiên dữ liệu từ /users/me (có avatar)
                                data.user = { ...data.user, ...fullUser };
                            }
                        } catch (fetchError) {
                            console.error('Failed to fetch full user profile:', fetchError);
                        }

                        // Return user object with jwt included
                        return {
                            id: data.user.id.toString(),
                            email: data.user.email,
                            name: data.user.username,
                            strapiToken: data.jwt,
                            // Include additional fields
                            fullName: data.user.fullName,
                            phoneNumber: data.user.phoneNumber,
                            address: data.user.address,
                            avatar: data.user.avatar,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.strapiToken = (user as any).strapiToken;
                token.id = user.id;
                token.fullName = (user as any).fullName;
                token.phoneNumber = (user as any).phoneNumber;
                token.address = (user as any).address;
                token.avatar = (user as any).avatar;
            }

            // Handle session update (e.g. from client-side update())
            if (trigger === "update" && session) {
                if (session.user?.fullName) token.fullName = session.user.fullName;
                if (session.user?.phoneNumber) token.phoneNumber = session.user.phoneNumber;
                if (session.user?.address) token.address = session.user.address;
                if (session.user?.avatar) token.avatar = session.user.avatar;
            }

            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (token) {
                session.user.id = token.id as string;
                (session as any).strapiToken = token.strapiToken;
                (session.user as any).fullName = token.fullName;
                (session.user as any).phoneNumber = token.phoneNumber;
                (session.user as any).address = token.address;
                (session.user as any).avatar = token.avatar;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
