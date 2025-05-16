import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, _) {
                try {
                    const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/users/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    if (!res.data) return null;

                    const user = res.data.user
                    if (user && user.id) {
                        return user;
                    }

                    return null;
                } catch (err) {
                    console.log("err: ", err);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as {
                id: string;
                username: string;
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

