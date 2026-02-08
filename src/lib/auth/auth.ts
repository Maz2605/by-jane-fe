import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Define User type that matches Strapi response
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
    role?: {
        id: number;
        name: string;
        description: string;
        type: string;
    };
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
                        const errorData = await res.json().catch(() => ({}));
                        console.error("❌ Strapi Login Failed:", JSON.stringify(errorData, null, 2));
                        return null;
                    }

                    const data: StrapiAuthResponse = await res.json();

                    if (data.jwt && data.user) {
                        // 🔥 FIX: Fetch full user profile (bao gồm Avatar & Role) ngay khi login
                        try {
                            const meRes = await fetch(`${API_URL}/api/users/me?populate=*`, {
                                headers: {
                                    Authorization: `Bearer ${data.jwt}`,
                                },
                            });

                            if (meRes.ok) {
                                const fullUser = await meRes.json();
                                console.log("🔥 DEBUG USER ME:", JSON.stringify(fullUser, null, 2));
                                // Merge data: ưu tiên dữ liệu từ /users/me (có avatar & role)
                                data.user = { ...data.user, ...fullUser };
                            } else {
                                console.error("❌ Failed to fetch /users/me:", meRes.status, meRes.statusText);
                                const errText = await meRes.text();
                                console.error("❌ Error Body:", errText);
                            }
                        } catch (fetchError) {
                            console.error('❌ Exception fetching full user profile:', fetchError);
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
                            role: data.user.role, // 🔥 ADD ROLE
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
    // Callbacks are now in auth.config.ts to support Middleware
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
