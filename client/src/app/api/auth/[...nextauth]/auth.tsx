import NextAuth, { NextAuthOptions } from "next-auth"
import { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authenticate_user } from "@/app/api/auth/[...nextauth]/server_actions"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      display_name: string;
      name: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    display_name: string;
    name: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: 'Sign in',
      credentials: {
        display_name: { label: 'text', type: 'text'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.display_name || !credentials.password) {
          return null;
        }
        const user = await authenticate_user(credentials.display_name, credentials.password);
       
        if (user) {
          return {
            id: String(user.id),
            display_name: user.display_name,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.display_name = user.display_name;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          display_name: token.display_name as string,
          name: token.name as string,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};