import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/checkout') ||
        nextUrl.pathname.startsWith('/admin');

      if (isOnProtectedRoute) {
        if (isLoggedIn) {
          // Logic check Role cho Admin
          if (nextUrl.pathname.startsWith('/admin')) {
            const userRole = (auth.user as any).role?.name;
            // Cho phép nếu role là "Admin" hoặc "Super Admin"
            if (userRole === 'Admin' || userRole === 'Super Admin') {
              return true;
            }
            return false;
          }
          return true;
        }
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.strapiToken = (user as any).strapiToken;
        token.id = user.id;
        token.fullName = (user as any).fullName;
        token.phoneNumber = (user as any).phoneNumber;
        token.address = (user as any).address;
        token.avatar = (user as any).avatar;
        token.role = (user as any).role; // 🔥 PERSIST ROLE
      }

      // Handle session update (e.g. from client-side update())
      if (trigger === "update" && session) {
        if (session.user?.fullName) token.fullName = session.user.fullName;
        if (session.user?.phoneNumber) token.phoneNumber = session.user.phoneNumber;
        if (session.user?.address) token.address = session.user.address;
        if (session.user?.avatar) token.avatar = session.user.avatar;
        // Role usually prevents update from client side for security
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
        (session.user as any).role = token.role; // 🔥 SEND ROLE TO CLIENT
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for edge compatibility
} satisfies NextAuthConfig;
